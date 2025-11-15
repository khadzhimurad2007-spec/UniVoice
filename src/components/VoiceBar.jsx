import React from 'react';

export default function VoiceBar({ isSupported, isListening, status, lastPhrase, onStart, onStop }) {
    if (!isSupported) return null;

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
                Статус: {status} <br />
                Последняя фраза: <strong>{lastPhrase || '...'}</strong>
            </div>

            <button
                onClick={isListening ? onStop : onStart}
                style={{
                    padding: '10px 16px',
                    borderRadius: '50px',
                    border: 'none',
                    background: isListening ? '#d33' : '#28a745',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 16,
                    cursor: 'pointer'
                }}
            >
                {isListening ? 'Стоп' : 'Старт'}
            </button>
        </div>
    );
}
