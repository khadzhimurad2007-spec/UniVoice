import React, { useState } from 'react';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #003366 0%, #004080 100%)',
        padding: '40px 20px',
        color: 'white'
    };

    const contentStyle = {
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    };

    const titleStyle = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#FFD700',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
    };

    const chatContainerStyle = {
        height: '400px',
        overflowY: 'auto',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    };

    const messageStyle = {
        marginBottom: '15px',
        padding: '12px 16px',
        borderRadius: '10px',
        maxWidth: '80%'
    };

    const userMessageStyle = {
        ...messageStyle,
        background: 'rgba(255, 215, 0, 0.3)',
        marginLeft: 'auto',
        border: '1px solid rgba(255, 215, 0, 0.5)'
    };

    const botMessageStyle = {
        ...messageStyle,
        background: 'rgba(255, 255, 255, 0.1)',
        marginRight: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    };

    const inputStyle = {
        width: '100%',
        padding: '15px',
        fontSize: '16px',
        border: '2px solid #FFD700',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: '#333'
    };

    const buttonStyle = {
        padding: '15px 30px',
        fontSize: '16px',
        backgroundColor: '#FFD700',
        color: '#003366',
        border: 'none',
        borderRadius: '10px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'all 0.3s ease'
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        // Имитация ответа AI
        setTimeout(() => {
            const responses = [
                "Я AI-помощник МАДИ. Чем могу помочь с учебными вопросами?",
                "Для получения расписания перейдите в соответствующий раздел.",
                "Могу помочь с информацией об учебном процессе МАДИ.",
                "Используйте голосовые команды для быстрой навигации."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            setMessages(prev => [...prev, { text: randomResponse, sender: 'bot' }]);
            setLoading(false);
        }, 1000);
    };

    return (
        <div style={containerStyle}>
            <div style={contentStyle}>
                <h1 style={titleStyle}>🤖 AI Помощник МАДИ</h1>
                
                <div style={chatContainerStyle}>
                    {messages.length === 0 ? (
                        <div style={{textAlign: 'center', color: '#FFD700', marginTop: '50px'}}>
                            <div style={{fontSize: '3rem', marginBottom: '20px'}}>🎓</div>
                            <h3>Задайте вопрос AI-помощнику</h3>
                            <p>Я помогу с учебными вопросами и навигацией по сайту</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} style={msg.sender === 'user' ? userMessageStyle : botMessageStyle}>
                                <strong>{msg.sender === 'user' ? 'Вы' : 'AI Помощник'}:</strong> {msg.text}
                            </div>
                        ))
                    )}
                    {loading && (
                        <div style={botMessageStyle}>
                            <strong>AI Помощник:</strong> <em>Печатает...</em>
                        </div>
                    )}
                </div>

                <div style={{display: 'flex', gap: '10px'}}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Задайте ваш вопрос..."
                        style={inputStyle}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={loading}
                        style={buttonStyle}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Отправить
                    </button>
                </div>

                <div style={{marginTop: '30px', padding: '20px', background: 'rgba(255,215,0,0.1)', borderRadius: '10px'}}>
                    <h4 style={{color: '#FFD700', marginBottom: '10px'}}>💡 Примеры вопросов:</h4>
                    <div style={{color: 'white', lineHeight: '1.6'}}>
                        • "Где найти расписание?"<br/>
                        • "Какие сегодня пары?"<br/>
                        • "Информация о факультетах"<br/>
                        • "Как пользоваться голосовым управлением?"
                    </div>
                </div>
            </div>
        </div>
    );
}