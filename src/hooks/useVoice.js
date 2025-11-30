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

    const speak = (text) => {
        if (!tts || !window.speechSynthesis) return;

        window.speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ru-RU';

        setIsSpeaking(true);

        // Временно останавливаем распознавание во время речи
        if (listeningRef.current) {
            recogRef.current?.stop();
        }

        window.speechSynthesis.speak(utter);

        utter.onend = () => {
            setIsSpeaking(false);
            // Возобновляем распознавание после речи, если были в режиме listening
            if (listeningRef.current) {
                setTimeout(() => {
                    try {
                        recogRef.current?.start();
                    } catch (e) {
                        console.log('Restart after speech failed:', e);
                    }
                }, 500);
            }
        };
    };

    const startListening = () => {
        if (!recogRef.current || isSpeaking) return;
        try {
            recogRef.current.start();
            setIsListening(true);
            listeningRef.current = true;
            setStatus('listening');
            wakeWordDetectedRef.current = false;
        } catch (e) {
            console.error('Start listening error:', e);
        }
    };

    const stopListening = () => {
        if (!recogRef.current) return;
        try {
            recogRef.current.stop();
            setIsListening(false);
            listeningRef.current = false;
            setStatus('idle');
            wakeWordDetectedRef.current = false;
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
                onStart: () => setStatus('listening'),
                onEnd: () => {
                    if (!isSpeaking) {
                        setStatus(listeningRef.current ? 'listening' : 'idle');
                    }
                },
                onError: (e) => {
                    console.error('Speech recognition error:', e);
                    setStatus('error');
                    // Автоматически перезапускаем при ошибках
                    if (listeningRef.current) {
                        setTimeout(() => {
                            try {
                                recogRef.current?.start();
                            } catch (err) {
                                console.log('Auto-restart failed:', err);
                            }
                        }, 1000);
                    }
                },
                onResult: async ({ transcript, isFinal }) => {
                    // Игнорируем распознавание во время речи ассистента
                    if (isSpeaking) return;

                    setLastPhrase(transcript);
                    const normalized = (transcript || '').toLowerCase().trim();

                    // Wake words detection - ДЕТЕКТИМ ТРИГГЕРНЫЕ СЛОВА ПОСТОЯННО
                    const wakeWords = ['юни', 'юнивойс', 'уни', 'унивойс', 'univoice', 'uni'];
                    const woke = wakeWords.some((w) => normalized.includes(w));

                    // 🔥 КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Автоактивация работает ВСЕГДА, даже когда не слушаем
                    if (woke && !listeningRef.current && !isSpeaking && !wakeWordDetectedRef.current) {
                        wakeWordDetectedRef.current = true;
                        console.log('🔥 Wake word detected, starting listening...');
                        startListening();
                        setTimeout(() => {
                            speak('Слушаю вас.');
                        }, 300);
                        return;
                    }

                    // Если режим не активен — не обрабатываем команды
                    if (!listeningRef.current) return;

                    if (isFinal && normalized.length > 2) { // Минимум 3 символа
                        console.log('Processing command:', normalized);
                        await routeCommand({
                            phrase: transcript,
                            context: {
                                speak,
                                navigate,
                                startListening,
                                stopListening,
                                nlu: nluRef.current,
                                isSpeaking
                            }
                        });
                    }
                }
            });

            // 🔥 КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: СРАЗУ ЗАПУСКАЕМ РАСПОЗНАВАНИЕ ДЛЯ ДЕТЕКЦИИ ТРИГГЕРНЫХ СЛОВ
            console.log('Starting continuous recognition for wake word detection...');
            recogRef.current.start();

            // NLU через OpenAI (если есть ключ)
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
            stopListening();
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
        speak
    };
}