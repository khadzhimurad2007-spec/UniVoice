import React from 'react';

export default function VoiceBar({ isSupported, isListening, status, lastPhrase, isSpeaking, onStart, onStop }) {
    if (!isSupported) return null;

    const getStatusColor = () => {
        if (isSpeaking) return '#FFA500'; // оранжевый когда говорит
        if (isListening) return '#28a745'; // зеленый когда слушает
        if (status === 'wake-word-mode') return '#17a2b8'; // синий когда ждет wake word
        return '#6c757d'; // серый
    };

    const getStatusText = () => {
        if (isSpeaking) return 'Говорит...';
        if (isListening) return 'Слушает...';
        if (status === 'wake-word-mode') return 'Жду "Юни"...';
        return 'Готов к работе';
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#f8f8f8',
            borderTop: '1px solid #ddd',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1000
        }}>
            <div style={{ fontSize: 12, color: '#666' }}>
                <div>Статус: <span style={{ color: getStatusColor(), fontWeight: 'bold' }}>{getStatusText()}</span></div>
                <div>Последняя фраза: <strong>{lastPhrase || '...'}</strong></div>
                <div style={{ fontSize: 10, opacity: 0.7 }}>
                    {!isListening && !isSpeaking ? 'Скажите "Юни" для активации' : 'Говорите команду...'}
                </div>
            </div>

            <button
                onClick={isListening ? onStop : onStart}
                disabled={isSpeaking}
                style={{
                    padding: '10px 16px',
                    borderRadius: '50px',
                    border: 'none',
                    background: isSpeaking ? '#FFA500' : (isListening ? '#d33' : '#28a745'),
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 16,
                    cursor: isSpeaking ? 'not-allowed' : 'pointer',
                    opacity: isSpeaking ? 0.7 : 1
                }}
            >
                {isSpeaking ? '🔊' : (isListening ? 'Стоп' : 'Старт')}
            </button>
        </div>
    );
}