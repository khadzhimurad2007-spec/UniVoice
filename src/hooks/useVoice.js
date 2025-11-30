import { useEffect, useRef, useState } from 'react';
import { SpeechRecognizer } from '../voice/recognizer';
import { routeCommand } from '../voice/commandRouter';
import { NLU } from '../voice/nlu';

export function useVoice({ navigate, tts = true }) {
    const [isSupported, setIsSupported] = useState(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    const [isListening, setIsListening] = useState(false);
    const [lastPhrase, setLastPhrase] = useState('');
    const [status, setStatus] = useState('idle');
    const [isSpeaking, setIsSpeaking] = useState(false);

    const recogRef = useRef(null);
    const nluRef = useRef(null);
    const listeningRef = useRef(false);
    const wakeWordDetectedRef = useRef(false);
    const shouldRestartRef = useRef(true);
    const speechBlockedRef = useRef(false);
    const lastCommandTimeRef = useRef(0);
    const isStoppedRef = useRef(false); // 🔥 НОВЫЙ ФЛАГ: отслеживаем ручную остановку

    const speak = (text) => {
        if (!tts || !window.speechSynthesis) return;

        // 🔥 ПОЛНАЯ БЛОКИРОВКА РАСПОЗНАВАНИЯ НА ВРЕМЯ РЕЧИ
        speechBlockedRef.current = true;
        console.log('🔇 BLOCKING recognition during TTS');

        // Останавливаем предыдущую речь
        window.speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ru-RU';

        setIsSpeaking(true);

        utter.onstart = () => {
            setIsSpeaking(true);
            speechBlockedRef.current = true;
        };

        utter.onend = () => {
            setIsSpeaking(false);
            // 🔥 РАЗБЛОКИРУЕМ ЧЕРЕЗ ТАЙМАУТ ДЛЯ НАДЕЖНОСТИ
            setTimeout(() => {
                speechBlockedRef.current = false;
                console.log('🎤 TTS ended - recognition unblocked');

                // 🔥 ВОЗОБНОВЛЯЕМ РАСПОЗНАВАНИЕ ПОСЛЕ РЕЧИ ДАЖЕ ЕСЛИ БЫЛИ ОСТАНОВЛЕНЫ
                // (для wake word detection)
                setTimeout(() => {
                    try {
                        recogRef.current?.start();
                        console.log('🔄 Restarted for wake word detection after speech');
                    } catch (e) {
                        console.log('Restart after speech failed:', e);
                    }
                }, 300);
            }, 500);
        };

        utter.onerror = () => {
            setIsSpeaking(false);
            speechBlockedRef.current = false;

            // 🔥 ТАКЖЕ ВОЗОБНОВЛЯЕМ ПРИ ОШИБКЕ TTS
            setTimeout(() => {
                try {
                    recogRef.current?.start();
                } catch (e) {
                    console.log('Restart after TTS error failed:', e);
                }
            }, 300);
        };

        window.speechSynthesis.speak(utter);
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        speechBlockedRef.current = false;
    };

    const startListening = () => {
        if (!recogRef.current || isSpeaking) return;
        try {
            recogRef.current.start();
            setIsListening(true);
            listeningRef.current = true;
            shouldRestartRef.current = true;
            isStoppedRef.current = false; // 🔥 СБРАСЫВАЕМ ФЛАГ ОСТАНОВКИ
            setStatus('listening');
            wakeWordDetectedRef.current = false;
            console.log('🎤 Listening started');
        } catch (e) {
            console.error('Start listening error:', e);
        }
    };

    const stopListening = () => {
        if (!recogRef.current) return;
        try {
            shouldRestartRef.current = false;
            recogRef.current.stop();
            setIsListening(false);
            listeningRef.current = false;
            isStoppedRef.current = true; // 🔥 УСТАНАВЛИВАЕМ ФЛАГ ОСТАНОВКИ
            setStatus('idle');
            wakeWordDetectedRef.current = false;
            console.log('🎤 Listening stopped (but wake words still work)');

            // 🔥 КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: ПЕРЕЗАПУСКАЕМ ДЛЯ WAKE WORD DETECTION СРАЗУ
            setTimeout(() => {
                if (!speechBlockedRef.current) {
                    try {
                        recogRef.current?.start();
                        console.log('🔄 Restarted for wake word detection after stop');
                    } catch (e) {
                        console.log('Restart after stop failed:', e);
                    }
                }
            }, 300);
        } catch (e) {
            console.error('Stop listening error:', e);
        }
    };

    useEffect(() => {
        try {
            recogRef.current = new SpeechRecognizer({
                lang: 'ru-RU',
                continuous: true,
                interimResults: true,
                onStart: () => {
                    console.log('🎤 Recognition started, listening:', listeningRef.current, 'stopped:', isStoppedRef.current);
                    setStatus(listeningRef.current ? 'listening' : 'wake-word-mode');
                },
                onEnd: () => {
                    console.log('🎤 Recognition ended, shouldRestart:', shouldRestartRef.current, 'speechBlocked:', speechBlockedRef.current);

                    // 🔥 ПРОВЕРЯЕМ БЛОКИРОВКУ ПЕРЕД ПЕРЕЗАПУСКОМ
                    if (speechBlockedRef.current) {
                        console.log('🔇 Skipping restart - speech blocked');
                        return;
                    }

                    // 🔥 КЛЮЧЕВОЕ: ПЕРЕЗАПУСКАЕМ ВСЕГДА ДЛЯ WAKE WORD DETECTION
                    // ДАЖЕ ЕСЛИ БЫЛИ ОСТАНОВЛЕНЫ КОМАНДОЙ "СТОП"
                    setTimeout(() => {
                        if (!speechBlockedRef.current) {
                            try {
                                recogRef.current?.start();
                                console.log('🔄 Auto-restarting (wake word mode)');
                            } catch (e) {
                                console.log('Auto-restart failed:', e);
                            }
                        }
                    }, 100);
                },
                onError: (e) => {
                    console.error('Speech recognition error:', e);
                    setStatus('error');

                    // 🔥 ПЕРЕЗАПУСК ПРИ ОШИБКАХ ТОЖЕ ВСЕГДА
                    setTimeout(() => {
                        if (!speechBlockedRef.current) {
                            try {
                                recogRef.current?.start();
                                console.log('🔄 Error recovery restart');
                            } catch (err) {
                                console.log('Error recovery restart failed:', err);
                            }
                        }
                    }, 1000);
                },
                onResult: async ({ transcript, isFinal }) => {
                    // 🔥 ПОЛНОСТЬЮ ИГНОРИРУЕМ РАСПОЗНАВАНИЕ ВО ВРЕМЯ РЕЧИ
                    if (speechBlockedRef.current) {
                        console.log('🔇 Ignoring - TTS active');
                        return;
                    }

                    setLastPhrase(transcript);
                    const normalized = (transcript || '').toLowerCase().trim();

                    console.log('🎯 Processing:', normalized, 'isFinal:', isFinal, 'isListening:', listeningRef.current, 'isStopped:', isStoppedRef.current);

                    // 🔥 КЛЮЧЕВОЕ: WAKE WORDS DETECTION РАБОТАЕТ ВСЕГДА
                    // ДАЖЕ ЕСЛИ МЫ В РЕЖИМЕ "СТОП"
                    const wakeWords = ['юни', 'юнивойс', 'уни', 'унивойс', 'univoice', 'uni'];
                    const woke = wakeWords.some((w) => normalized.includes(w));

                    if (woke && !listeningRef.current && !wakeWordDetectedRef.current) {
                        wakeWordDetectedRef.current = true;
                        console.log('🔥 Wake word detected, activating from stopped state!');

                        // 🔥 СБРАСЫВАЕМ ФЛАГ ОСТАНОВКИ И АКТИВИРУЕМСЯ
                        isStoppedRef.current = false;
                        startListening();

                        setTimeout(() => {
                            speak('Слушаю вас.');
                        }, 200);
                        return;
                    }

                    // 🔥 ЕСЛИ МЫ В РЕЖИМЕ "СТОП" - ОБРАБАТЫВАЕМ ТОЛЬКО WAKE WORDS
                    if (isStoppedRef.current && !listeningRef.current) {
                        console.log('⏸️ In stopped mode, only processing wake words');
                        return;
                    }

                    // Если режим не активен — не обрабатываем команды
                    if (!listeningRef.current) return;

                    if (isFinal && normalized.length > 2) {
                        // 🔥 ЗАЩИТА ОТ ПОВТОРНОЙ ОБРАБОТКИ
                        const now = Date.now();
                        if (now - lastCommandTimeRef.current < 1000) {
                            console.log('⏱️ Skipping duplicate command');
                            return;
                        }
                        lastCommandTimeRef.current = now;

                        console.log('🎯 Executing command:', normalized);
                        await routeCommand({
                            phrase: transcript,
                            context: {
                                speak,
                                navigate,
                                startListening,
                                stopListening,
                                stopSpeaking,
                                nlu: nluRef.current,
                                isSpeaking: speechBlockedRef.current
                            }
                        });
                    }
                }
            });

            // 🔥 СРАЗУ ЗАПУСКАЕМ НЕПРЕРЫВНОЕ РАСПОЗНАВАНИЕ ДЛЯ WAKE WORDS
            console.log('🚀 Starting continuous recognition for wake words...');
            recogRef.current.start();

            // NLU через OpenAI
            const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
            if (apiKey) {
                nluRef.current = new NLU({ apiKey });
            }
        } catch (e) {
            console.error('Voice hook initialization error:', e);
            setIsSupported(false);
            setStatus('error');
        }

        return () => {
            shouldRestartRef.current = false;
            listeningRef.current = false;
            isStoppedRef.current = false;
            speechBlockedRef.current = false;
            if (recogRef.current) {
                try {
                    recogRef.current.stop();
                } catch (e) { }
            }
            recogRef.current = null;
            nluRef.current = null;
            window.speechSynthesis.cancel();
        };
    }, []);

    return {
        isSupported,
        isListening,
        lastPhrase,
        status,
        isSpeaking,
        startListening,
        stopListening,
        stopSpeaking,
        speak
    };
}