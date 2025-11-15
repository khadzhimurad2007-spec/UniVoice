import { useEffect, useRef, useState } from 'react';
import { SpeechRecognizer } from '../voice/recognizer';
import { routeCommand } from '../voice/commandRouter';
import { NLU } from '../voice/nlu';

export function useVoice({ navigate, tts = true }) {
    const [isSupported, setIsSupported] = useState(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    const [isListening, setIsListening] = useState(false);
    const [lastPhrase, setLastPhrase] = useState('');
    const [status, setStatus] = useState('idle'); // idle | listening | error

    const recogRef = useRef(null);
    const nluRef = useRef(null);
    const listeningRef = useRef(false);

    const speak = (text) => {
        if (!tts || !window.speechSynthesis) return;
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ru-RU';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
    };

    const createCalendarEvent = async ({ title, when, sourcePhrase }) => {
        console.log('createCalendarEvent', { title, when, sourcePhrase });
        // Здесь можешь подключить свой сервис календаря
    };
    const createReminder = async ({ title, when, sourcePhrase }) => {
        console.log('createReminder', { title, when, sourcePhrase });
        // Если используешь services/ReminderService.js напрямую в commandCatalog,
        // эта заглушка не понадобится.
    };

    const startListening = () => {
        if (!recogRef.current) return;
        try {
            recogRef.current.start();
            setIsListening(true);
            listeningRef.current = true;
            setStatus('listening');
        } catch (e) {
            console.error(e);
        }
    };
    const stopListening = () => {
        if (!recogRef.current) return;
        try {
            recogRef.current.stop();
            setIsListening(false);
            listeningRef.current = false;
            setStatus('idle');
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        try {
            recogRef.current = new SpeechRecognizer({
                lang: 'ru-RU',
                continuous: true,
                interimResults: true,
                onStart: () => setStatus('listening'),
                onEnd: () => setStatus(listeningRef.current ? 'listening' : 'idle'),
                onError: (e) => {
                    console.error(e);
                    setStatus('error');
                },
                onResult: async ({ transcript, isFinal }) => {
                    setLastPhrase(transcript);
                    const normalized = (transcript || '').toLowerCase();

                    // Wake words: автозапуск микрофона по "юнивойс"
                    const wakeWords = ['юнивойс', 'унивойс', 'univoice'];
                    const woke = wakeWords.some((w) => normalized.includes(w));

                    // Автоматическое включение, если услышали wake word и сейчас не слушаем
                    if (woke && !listeningRef.current) {
                        startListening();
                        speak('Слушаю.');
                        return;
                    }

                    // Если режим не активен — не маршрутизируем команды
                    if (!listeningRef.current) return;

                    if (isFinal) {
                        await routeCommand({
                            phrase: transcript,
                            context: {
                                speak,
                                navigate,
                                startListening,
                                stopListening,
                                createCalendarEvent,
                                createReminder,
                                nlu: nluRef.current
                            }
                        });
                    }
                }
            });

            // Опционально: NLU через OpenAI (если есть ключ в .env)
            const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
            if (apiKey) {
                nluRef.current = new NLU({ apiKey });
            }
        } catch (e) {
            console.error(e);
            setIsSupported(false);
            setStatus('error');
        }

        return () => {
            stopListening();
            recogRef.current = null;
            nluRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        isSupported,
        isListening,
        lastPhrase,
        status,
        startListening,
        stopListening,
        speak
    };
}
