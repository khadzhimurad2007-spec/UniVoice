import React, { useState } from 'react';

export default function RemindersPage() {
    const [reminders, setReminders] = useState([]);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');

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

    const formStyle = {
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '25px',
        borderRadius: '10px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #FFD700',
        borderRadius: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: '#333',
        marginBottom: '15px'
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '80px',
        resize: 'vertical'
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
        transition: 'all 0.3s ease',
        marginRight: '10px'
    };

    const reminderCardStyle = {
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '15px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const deleteButtonStyle = {
        padding: '8px 15px',
        backgroundColor: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };

    const addReminder = () => {
        if (!title.trim() || !date) return;

        const newReminder = {
            id: Date.now(),
            title,
            date,
            time,
            description,
            completed: false
        };

        setReminders(prev => [newReminder, ...prev]);
        setTitle('');
        setDate('');
        setTime('');
        setDescription('');
    };

    const deleteReminder = (id) => {
        setReminders(prev => prev.filter(reminder => reminder.id !== id));
    };

    const toggleComplete = (id) => {
        setReminders(prev => prev.map(reminder =>
            reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
        ));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    return (
        <div style={containerStyle}>
            <div style={contentStyle}>
                <h1 style={titleStyle}>⏰ Напоминания МАДИ</h1>

                <div style={formStyle}>
                    <h3 style={{color: '#FFD700', marginBottom: '20px'}}>➕ Добавить новое напоминание</h3>
                    
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Название напоминания (например: Сдать лабораторную)"
                        style={inputStyle}
                    />
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={inputStyle}
                        />
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Описание (необязательно)"
                        style={textareaStyle}
                    />
                    
                    <button 
                        onClick={addReminder}
                        style={buttonStyle}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        ➕ Добавить напоминание
                    </button>
                </div>

                <div>
                    <h3 style={{color: '#FFD700', marginBottom: '20px'}}>
                        📋 Мои напоминания ({reminders.length})
                    </h3>
                    
                    {reminders.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '10px',
                            color: '#FFD700'
                        }}>
                            <div style={{fontSize: '3rem', marginBottom: '15px'}}>📝</div>
                            <p>У вас пока нет напоминаний</p>
                            <p>Добавьте первое напоминание выше</p>
                        </div>
                    ) : (
                        reminders.map(reminder => (
                            <div key={reminder.id} style={{
                                ...reminderCardStyle,
                                opacity: reminder.completed ? 0.6 : 1,
                                textDecoration: reminder.completed ? 'line-through' : 'none'
                            }}>
                                <div style={{flex: 1}}>
                                    <h4 style={{margin: '0 0 5px 0', color: reminder.completed ? '#aaa' : 'white'}}>
                                        {reminder.title}
                                    </h4>
                                    <p style={{margin: '0 0 5px 0', fontSize: '14px', opacity: 0.8}}>
                                        📅 {formatDate(reminder.date)} {reminder.time && `⏰ ${reminder.time}`}
                                    </p>
                                    {reminder.description && (
                                        <p style={{margin: 0, fontSize: '14px', opacity: 0.7}}>
                                            {reminder.description}
                                        </p>
                                    )}
                                </div>
                                
                                <div style={{display: 'flex', gap: '10px'}}>
                                    <button
                                        onClick={() => toggleComplete(reminder.id)}
                                        style={{
                                            ...buttonStyle,
                                            padding: '8px 15px',
                                            fontSize: '14px',
                                            backgroundColor: reminder.completed ? '#28a745' : '#6c757d'
                                        }}
                                    >
                                        {reminder.completed ? '✓' : '◯'}
                                    </button>
                                    <button
                                        onClick={() => deleteReminder(reminder.id)}
                                        style={deleteButtonStyle}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={{marginTop: '30px', padding: '20px', background: 'rgba(255,215,0,0.1)', borderRadius: '10px'}}>
                    <h4 style={{color: '#FFD700', marginBottom: '10px'}}>💡 Для чего использовать:</h4>
                    <div style={{color: 'white', lineHeight: '1.6'}}>
                        • Напоминания о сдаче лабораторных работ<br/>
                        • Дедлайны по курсовым проектам<br/>
                        • Даты экзаменов и зачетов<br/>
                        • Встречи с преподавателями<br/>
                        • Важные учебные события
                    </div>
                </div>
            </div>
        </div>
    );
}