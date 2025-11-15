export class SpeechRecognizer {
    constructor({ lang = 'ru-RU', continuous = true, interimResults = true, onResult, onError, onStart, onEnd }) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) throw new Error('SpeechRecognition API not supported.');
        this.recognizer = new SR();
        this.recognizer.lang = lang;
        this.recognizer.continuous = continuous;
        this.recognizer.interimResults = interimResults;

        this.recognizer.onresult = (event) => {
            let transcript = '';
            let isFinal = false;
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
                if (event.results[i].isFinal) isFinal = true;
            }
            onResult && onResult({ transcript: transcript.trim(), isFinal });
        };
        this.recognizer.onerror = (e) => onError && onError(e);
        this.recognizer.onstart = () => onStart && onStart();
        this.recognizer.onend = () => onEnd && onEnd();
    }

    start() {
        try { this.recognizer.start(); } catch (_) { }
    }
    stop() {
        try { this.recognizer.stop(); } catch (_) { }
    }
}
