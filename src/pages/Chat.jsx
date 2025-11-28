import React, { useState, useRef, useEffect } from 'react';
import { askGPT } from '../api/gpt.js';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Системный промпт с информацией о приложении
    const systemPrompt = `Ты - AI помощник для приложения UniVoice МАДИ. 

ИНФОРМАЦИЯ О ПРИЛОЖЕНИИ:
UniVoice - это веб-приложение для студентов МАДИ со следующими функциями:

1. НАПОМИНАНИЯ:
   - Создание напоминаний о лабораторных, экзаменах, дедлайнах
   - Уведомления за 1 минуту до события
   - Сохранение в браузере (localStorage)
   - Работает даже при переходе на другие страницы

2. РАСПИСАНИЕ:
   - Просмотр учебного расписания
   - Поиск по предметам и преподавателям
   - Фильтрация по дням недели

3. УЧЕБНЫЕ МАТЕРИАЛЫ:
   - Доступ к лекциям и методичкам
   - Поиск по предметам
   - Быстрый доступ к материалам

4. ЧАТ-ПОМОЩНИК:
   - Ты находишься здесь!
   - Отвечаешь на вопросы о приложении
   - Помогаешь с учебными вопросами

5. ГОЛОСОВОЕ УПРАВЛЕНИЕ:
   - Голосовые команды для навигации
   - Голосовой ввод в чате
   - Быстрый доступ к функциям

ТЕХНИЧЕСКАЯ ИНФОРМАЦИЯ:
- Frontend: React.js
- Стили: inline CSS
- Хранение данных: localStorage
- Уведомления: Browser Notifications + Service Worker

КАК ПОЛЬЗОВАТЬСЯ ПРИЛОЖЕНИЕМ:

НАПОМИНАНИЯ:
1. Перейдите в раздел "Напоминания"
2. Заполните название, дату и время
3. Нажмите "Добавить напоминание"
4. Уведомление придет за 1 минуту до события

РАСПИСАНИЕ:
1. Откройте раздел "Расписание" 
2. Используйте фильтры для поиска
3. Нажмите на предмет для деталей

УЧЕБНЫЕ МАТЕРИАЛЫ:
1. Перейдите в "Материалы"
2. Выберите предмет
3. Скачайте нужные файлы

ГОЛОСОВОЕ УПРАВЛЕНИЕ:
1. Нажмите на иконку микрофона
2. Произнесите команду
3. Приложение выполнит действие

ТВОИ ОСОБЕННОСТИ:
- Отвечай подробно и помогай пользователям
- Знай все функции приложения
- Объясняй как пользоваться каждой функцией
- Помогай с техническими проблемами
- Отвечай на вопросы об учебе в МАДИ
- Будь полезным и дружелюбным помощником

Отвечай на русском языке. Будь конкретным и полезным!`;

    // Начальное сообщение
    useEffect(() => {
        setMessages([
            {
                text: "Привет! Я AI помощник UniVoice для студентов МАДИ. Могу помочь с использованием приложения, ответить на вопросы о функциях, напоминаниях, расписании и учебных материалах. Чем могу помочь?",
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
    }, []);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = {
            text: input,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Используем реальный GPT API с системным промптом
            const fullPrompt = `${systemPrompt}\n\nВопрос пользователя: ${input}`;
            const response = await askGPT(fullPrompt);

            const botMessage = {
                text: response,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('GPT Error:', error);
            const errorMessage = {
                text: "Извините, произошла ошибка при обращении к AI. Пожалуйста, попробуйте еще раз.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([
            {
                text: "Привет! Я AI помощник UniVoice для студентов МАДИ. Чем могу помочь?",
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
    };

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
        height: '500px',
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
        maxWidth: '80%',
        wordWrap: 'break-word'
    };

    const userMessageStyle = {
        ...messageStyle,
        background: 'rgba(255, 215, 0, 0.3)',
        marginLeft: 'auto',
        border: '1px solid rgba(255, 215, 0, 0.5)',
        textAlign: 'right'
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

    return (
        <div style={containerStyle}>
            <div style={contentStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 style={titleStyle}>🤖 AI Помощник UniVoice</h1>
                    <button
                        onClick={clearChat}
                        style={{
                            ...buttonStyle,
                            padding: '10px 20px',
                            fontSize: '14px',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white'
                        }}
                    >
                        🗑️ Очистить чат
                    </button>
                </div>

                <div style={chatContainerStyle}>
                    {messages.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#FFD700', marginTop: '50px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎓</div>
                            <h3>Задайте вопрос AI-помощнику</h3>
                            <p>Я помогу с учебными вопросами и навигацией по сайту</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} style={msg.sender === 'user' ? userMessageStyle : botMessageStyle}>
                                <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>
                                    {msg.sender === 'user' ? 'Вы' : 'AI Помощник'} • {msg.timestamp.toLocaleTimeString()}
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                            </div>
                        ))
                    )}
                    {loading && (
                        <div style={botMessageStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid #FFD700',
                                    borderTop: '2px solid transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                AI помощник печатает...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Задайте вопрос о приложении или учебе в МАДИ..."
                        style={inputStyle}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        style={buttonStyle}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        {loading ? '⏳' : '📤'}
                    </button>
                </div>

                <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,215,0,0.1)', borderRadius: '10px' }}>
                    <h4 style={{ color: '#FFD700', marginBottom: '10px' }}>💡 Примеры вопросов:</h4>
                    <div style={{ color: 'white', lineHeight: '1.6' }}>
                        • "Как создать напоминание?"<br />
                        • "Где найти расписание занятий?"<br />
                        • "Как пользоваться голосовым управлением?"<br />
                        • "Какие функции есть в приложении?"<br />
                        • "Как работают уведомления в напоминаниях?"
                    </div>
                </div>

                <style>
                    {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    `}
                </style>
            </div>
        </div>
    );
}