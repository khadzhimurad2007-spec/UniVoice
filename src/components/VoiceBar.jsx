import React from 'react';

export default function VoiceBar({ isSupported, isListening, status, lastPhrase, isSpeaking, onStart, onStop }) {
    if (!isSupported) return null;

    const getStatusColor = () => {
        if (isSpeaking) return '#FFA500';
        if (isListening) return '#4CAF50';
        if (status === 'wake-word-mode') return '#2196F3';
        return '#9E9E9E';
    };

    const getStatusText = () => {
        if (isSpeaking) return 'Говорит';
        if (isListening) return 'Слушает';
        if (status === 'wake-word-mode') return 'Ожидание';
        return 'Неактивен';
    };

    const getStatusMessage = () => {
        if (isSpeaking) return 'Можете перебить командой';
        if (isListening) return 'Говорите команду...';
        if (status === 'wake-word-mode') return 'Скажите "Юни" для активации';
        return 'Нажмите Старт или скажите "Юни"';
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1000,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
            borderTop: '1px solid rgba(255,255,255,0.2)'
        }}>
            {/* 🔥 ЛЕВАЯ ЧАСТЬ - ИНДИКАТОР С АНИМАЦИЕЙ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                {/* АНИМИРОВАННЫЙ ИНДИКАТОР */}
                <div style={{
                    position: 'relative',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* ФОН КРУГА */}
                    <div style={{
                        position: 'absolute',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* ИКОНКА МИКРОФОНА */}
                        <div style={{
                            fontSize: '20px',
                            color: getStatusColor(),
                            transition: 'color 0.3s ease'
                        }}>
                            {isSpeaking ? '🔊' : (isListening ? '🎤' : '⏸️')}
                        </div>
                    </div>

                    {/* 🔥 АНИМАЦИЯ ВОЛН ДЛЯ РЕЖИМА СЛУШАНИЯ */}
                    {isListening && (
                        <>
                            <div style={{
                                position: 'absolute',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                border: `2px solid ${getStatusColor()}`,
                                animation: 'pulse 1.5s ease-in-out infinite both'
                            }} />
                            <div style={{
                                position: 'absolute',
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                border: `2px solid ${getStatusColor()}`,
                                animation: 'pulse 1.5s ease-in-out 0.5s infinite both'
                            }} />
                            <div style={{
                                position: 'absolute',
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                border: `2px solid ${getStatusColor()}`,
                                animation: 'pulse 1.5s ease-in-out 1s infinite both'
                            }} />
                        </>
                    )}

                    {/* 🔥 АНИМАЦИЯ ДЛЯ РЕЖИМА ГОВОРЕНИЯ */}
                    {isSpeaking && (
                        <>
                            <div style={{
                                position: 'absolute',
                                width: '55px',
                                height: '55px',
                                borderRadius: '50%',
                                background: 'rgba(255,165,0,0.3)',
                                animation: 'speakPulse 0.8s ease-in-out infinite both'
                            }} />
                            <div style={{
                                position: 'absolute',
                                width: '65px',
                                height: '65px',
                                borderRadius: '50%',
                                background: 'rgba(255,165,0,0.2)',
                                animation: 'speakPulse 0.8s ease-in-out 0.2s infinite both'
                            }} />
                        </>
                    )}

                    {/* 🔥 АНИМАЦИЯ ДЛЯ РЕЖИМА ОЖИДАНИЯ */}
                    {status === 'wake-word-mode' && (
                        <div style={{
                            position: 'absolute',
                            width: '58px',
                            height: '58px',
                            borderRadius: '50%',
                            border: `2px solid ${getStatusColor()}`,
                            animation: 'breathe 3s ease-in-out infinite both'
                        }} />
                    )}
                </div>

                {/* ТЕКСТОВАЯ ИНФОРМАЦИЯ */}
                <div style={{ color: 'white', minWidth: '200px' }}>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>UniVoice Assistant</span>
                        <span style={{
                            fontSize: '11px',
                            background: 'rgba(255,255,255,0.2)',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            color: getStatusColor(),
                            fontWeight: 'normal'
                        }}>
                            {getStatusText()}
                        </span>
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>
                        {lastPhrase ? `«${lastPhrase}»` : getStatusMessage()}
                    </div>
                    {lastPhrase && (
                        <div style={{ fontSize: '11px', opacity: 0.7 }}>
                            {getStatusMessage()}
                        </div>
                    )}
                </div>
            </div>

            {/* 🔥 ПРАВАЯ ЧАСТЬ - КНОПКА УПРАВЛЕНИЯ */}
            <button
                onClick={isListening ? onStop : onStart}
                disabled={isSpeaking}
                style={{
                    padding: '12px 24px',
                    borderRadius: '25px',
                    border: 'none',
                    background: isSpeaking ?
                        'linear-gradient(135deg, #FFA500, #FF8C00)' :
                        isListening ?
                            'linear-gradient(135deg, #FF6B6B, #EE5A52)' :
                            'linear-gradient(135deg, #4CAF50, #45a049)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: isSpeaking ? 'not-allowed' : 'pointer',
                    opacity: isSpeaking ? 0.8 : 1,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    minWidth: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}
                onMouseEnter={(e) => {
                    if (!isSpeaking) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }}
            >
                {isSpeaking ? (
                    <>
                        <span style={{ fontSize: '16px' }}>🔊</span>
                        Говорит
                    </>
                ) : isListening ? (
                    <>
                        <span style={{ fontSize: '16px' }}>⏹️</span>
                        Стоп
                    </>
                ) : (
                    <>
                        <span style={{ fontSize: '16px' }}>🎤</span>
                        Старт
                    </>
                )}
            </button>

            {/* 🔥 СТИЛИ АНИМАЦИЙ */}
            <style>
                {`
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1.2);
                        opacity: 0;
                    }
                }

                @keyframes speakPulse {
                    0% {
                        transform: scale(1);
                        opacity: 0.7;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.4;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 0.7;
                    }
                }

                @keyframes breathe {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scale(1.05);
                        opacity: 0.8;
                    }
                }

                /* Анимация для текста последней фразы */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .last-phrase {
                    animation: fadeIn 0.3s ease-out;
                }
                `}
            </style>
        </div>
    );
}