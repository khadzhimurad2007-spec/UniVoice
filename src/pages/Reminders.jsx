import React, { useState, useEffect } from 'react';

export default function RemindersPage() {
    const [reminders, setReminders] = useState([]);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
    const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    // 🔔 Инициализация при загрузке
    useEffect(() => {
        initializeApp();

        // Слушаем сообщения от Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
        }

        return () => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
            }
        };
    }, []);

    const initializeApp = async () => {
        // 1. Загрузка напоминаний из localStorage
        loadRemindersFromStorage();

        // 2. Проверяем текущий статус уведомлений
        checkNotificationStatus();

        // 3. Регистрация Service Worker
        await registerServiceWorker();
    };

    const loadRemindersFromStorage = () => {
        try {
            const savedReminders = localStorage.getItem('madi-reminders');
            if (savedReminders) {
                const parsedReminders = JSON.parse(savedReminders);
                setReminders(parsedReminders);
                console.log('📂 Loaded reminders from storage:', parsedReminders.length);
            }
        } catch (error) {
            console.error('❌ Error loading reminders:', error);
        }
    };

    const checkNotificationStatus = () => {
        if ('Notification' in window) {
            setNotificationsEnabled(Notification.permission === 'granted');
        }
    };

    const registerServiceWorker = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('🔧 Service Worker registered');

                // Ждем пока Service Worker станет активным
                if (registration.installing) {
                    registration.installing.addEventListener('statechange', (event) => {
                        if (event.target.state === 'activated') {
                            setServiceWorkerReady(true);
                            startBackgroundNotifications();
                        }
                    });
                } else if (registration.active) {
                    setServiceWorkerReady(true);
                    startBackgroundNotifications();
                }
            } catch (error) {
                console.log('❌ Service Worker registration failed:', error);
                setServiceWorkerReady(false);
            }
        } else {
            console.log('❌ Service Worker not supported');
            setServiceWorkerReady(false);
        }
    };

    const handleServiceWorkerMessage = (event) => {
        if (event.data && event.data.type === 'REMINDER_TRIGGERED') {
            console.log('📩 Message from Service Worker:', event.data);
            setReminders(event.data.updatedReminders);
            localStorage.setItem('madi-reminders', JSON.stringify(event.data.updatedReminders));
        }
    };

    // 🔔 Запуск фоновых уведомлений через Service Worker
    const startBackgroundNotifications = () => {
        if (serviceWorkerReady && navigator.serviceWorker.controller && notificationsEnabled) {
            navigator.serviceWorker.controller.postMessage({
                type: 'START_BACKGROUND_CHECK',
                reminders: reminders
            });
            console.log('🚀 Background notifications started');
        } else {
            console.log('⚠️ Background notifications disabled');
        }
    };

    // 🔔 Сохранение напоминаний и обновление Service Worker
    useEffect(() => {
        if (reminders.length > 0) {
            localStorage.setItem('madi-reminders', JSON.stringify(reminders));
            console.log('💾 Saved reminders to storage:', reminders.length);

            // Обновляем Service Worker только если уведомления разрешены
            if (serviceWorkerReady && navigator.serviceWorker.controller && notificationsEnabled) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'START_BACKGROUND_CHECK',
                    reminders: reminders
                });
            }
        }
    }, [reminders, serviceWorkerReady, notificationsEnabled]);

    // 🔔 Проверка напоминаний в активной вкладке (только если уведомления разрешены)
    useEffect(() => {
        if (!notificationsEnabled) return;

        const checkRemindersInTab = () => {
            const now = new Date();
            let updated = false;
            const updatedReminders = [...reminders];

            updatedReminders.forEach((reminder, index) => {
                if (reminder.completed || reminder.notified) return;
                if (!reminder.date) return;

                try {
                    const reminderDateTime = new Date(`${reminder.date}T${reminder.time || '23:59'}`);
                    const diff = reminderDateTime - now;

                    if (diff > 0 && diff <= 60000) {
                        console.log('🎯 Tab: Triggering notification for:', reminder.title);
                        showNotification(reminder);

                        updatedReminders[index].notified = true;
                        updated = true;
                    }
                } catch (error) {
                    console.error('❌ Error processing reminder:', error);
                }
            });

            if (updated) {
                setReminders(updatedReminders);
            }
        };

        const interval = setInterval(checkRemindersInTab, 10000);
        checkRemindersInTab();

        return () => clearInterval(interval);
    }, [reminders, notificationsEnabled]);

    const showNotification = (reminder) => {
        if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`⏰ Напоминание МАДИ: ${reminder.title}`, {
                body: reminder.description || `Время: ${formatDateTime(reminder.date, reminder.time)}`,
                icon: '/favicon.ico',
                tag: `reminder-${reminder.id}`,
                requireInteraction: true
            });
        }
        // Если уведомления запрещены, ничего не показываем
    };

    const enableNotifications = async () => {
        if (!('Notification' in window)) {
            alert('Ваш браузер не поддерживает уведомления');
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setNotificationsEnabled(true);
                alert('✅ Уведомления разрешены! Вы будете получать напоминания.');
            } else if (permission === 'denied') {
                setNotificationsEnabled(false);
                alert('❌ Уведомления запрещены. Вы не будете получать напоминания.');
            } else {
                setNotificationsEnabled(false);
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            alert('Ошибка при запросе разрешения на уведомления');
        }
    };

    const disableNotifications = () => {
        setNotificationsEnabled(false);
        alert('🔕 Уведомления отключены. Вы не будете получать напоминания.\n\nЧтобы снова включить, нажмите "Разрешить уведомления".');
    };

    const addReminder = () => {
        if (!title.trim() || !date) {
            alert('Пожалуйста, заполните название и дату напоминания');
            return;
        }

        const reminderDateTime = new Date(`${date}T${time || '23:59'}`);
        const now = new Date();

        if (reminderDateTime <= now) {
            alert('Пожалуйста, выберите дату и время в будущем');
            return;
        }

        const newReminder = {
            id: Date.now() + Math.random(),
            title: title.trim(),
            date,
            time: time || '23:59',
            description: description.trim(),
            completed: false,
            notified: false,
            createdAt: new Date().toISOString()
        };

        setReminders(prev => {
            const updated = [newReminder, ...prev];
            console.log('✅ Added new reminder, total:', updated.length);
            return updated;
        });

        // Сбрасываем форму
        setTitle('');
        setDate('');
        setTime('');
        setDescription('');

        if (notificationsEnabled) {
            alert(`✅ Напоминание "${title}" добавлено!\nУведомление придет за 1 минуту до события.`);
        } else {
            alert(`✅ Напоминание "${title}" добавлено!\n\n⚠️ Уведомления отключены. Чтобы получать напоминания, разрешите уведомления.`);
        }
    };

    const deleteReminder = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить это напоминание?')) {
            setReminders(prev => prev.filter(reminder => reminder.id !== id));
        }
    };

    const toggleComplete = (id) => {
        setReminders(prev => prev.map(reminder =>
            reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
        ));
    };

    const resetNotification = (id) => {
        setReminders(prev => prev.map(reminder =>
            reminder.id === id ? { ...reminder, notified: false } : reminder
        ));
    };

    const clearAllCompleted = () => {
        const completedCount = reminders.filter(r => r.completed).length;
        if (completedCount > 0 && window.confirm(`Удалить все выполненные напоминания (${completedCount})?`)) {
            setReminders(prev => prev.filter(reminder => !reminder.completed));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const formatDateTime = (dateString, timeString) => {
        const date = new Date(`${dateString}T${timeString}`);
        return date.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeUntilReminder = (dateString, timeString) => {
        const reminderDate = new Date(`${dateString}T${timeString}`);
        const now = new Date();
        const diff = reminderDate - now;

        if (diff <= 0) return 'Время прошло';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `через ${days}д ${hours}ч`;
        if (hours > 0) return `через ${hours}ч ${minutes}м`;
        return `через ${minutes}м`;
    };

    // Стили
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
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: '#FFD700',
        color: '#003366',
        border: 'none',
        borderRadius: '8px',
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
        border: '1px solid rgba(255, 255, 255, 0.2)'
    };

    const deleteButtonStyle = {
        padding: '8px 15px',
        backgroundColor: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };

    const activeReminders = reminders.filter(r => !r.completed);
    const completedReminders = reminders.filter(r => r.completed);

    return (
        <div style={containerStyle}>
            <div style={contentStyle}>
                <h1 style={titleStyle}>⏰ Напоминания МАДИ</h1>

                {/* Управление уведомлениями */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                        <button
                            onClick={enableNotifications}
                            style={{
                                ...buttonStyle,
                                backgroundColor: notificationsEnabled ? '#28a745' : '#17a2b8',
                                padding: '12px 20px'
                            }}
                        >
                            {notificationsEnabled ? '✅ Уведомления разрешены' : '🔔 Разрешить уведомления'}
                        </button>

                        {notificationsEnabled && (
                            <button
                                onClick={disableNotifications}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: '#dc3545',
                                    padding: '12px 20px'
                                }}
                            >
                                🔕 Запретить уведомления
                            </button>
                        )}
                    </div>

                    <div style={{ marginTop: '15px', fontSize: '14px', opacity: 0.8 }}>
                        <p>
                            {notificationsEnabled ? (
                                '✅ Вы будете получать уведомления за 1 минуту до события'
                            ) : (
                                '⚠️ Уведомления отключены. Нажмите "Разрешить уведомления" чтобы получать напоминания'
                            )}
                        </p>
                        <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '5px' }}>
                            💾 Сохранено напоминаний: {reminders.length}
                        </p>
                    </div>
                </div>

                {/* Форма добавления напоминания */}
                <div style={formStyle}>
                    <h3 style={{ color: '#FFD700', marginBottom: '20px' }}>➕ Добавить новое напоминание</h3>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Название напоминания (например: Сдать лабораторную)"
                        style={inputStyle}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={inputStyle}
                            min={new Date().toISOString().split('T')[0]}
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

                {/* Список напоминаний */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ color: '#FFD700', margin: 0 }}>
                            📋 Активные напоминания ({activeReminders.length})
                        </h3>
                        {completedReminders.length > 0 && (
                            <button
                                onClick={clearAllCompleted}
                                style={{
                                    ...buttonStyle,
                                    padding: '8px 15px',
                                    fontSize: '14px',
                                    backgroundColor: '#dc3545'
                                }}
                            >
                                🗑️ Очистить выполненные
                            </button>
                        )}
                    </div>

                    {reminders.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '10px',
                            color: '#FFD700'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📝</div>
                            <p>У вас пока нет напоминаний</p>
                            <p>Добавьте первое напоминание выше</p>
                        </div>
                    ) : (
                        <>
                            {activeReminders.map(reminder => (
                                <div key={reminder.id} style={reminderCardStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 8px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {reminder.title}
                                                {reminder.notified && (
                                                    <span style={{ fontSize: '12px', color: '#FFD700', background: 'rgba(255,215,0,0.2)', padding: '2px 8px', borderRadius: '10px' }}>
                                                        🔔 Уведомлено
                                                    </span>
                                                )}
                                            </h4>
                                            <p style={{ margin: '0 0 5px 0', fontSize: '14px', opacity: 0.8 }}>
                                                📅 {formatDateTime(reminder.date, reminder.time)}
                                            </p>
                                            <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#FFD700' }}>
                                                ⏳ {getTimeUntilReminder(reminder.date, reminder.time)}
                                            </p>
                                            {reminder.description && (
                                                <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.7, fontStyle: 'italic' }}>
                                                    {reminder.description}
                                                </p>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                                            {reminder.notified ? (
                                                <button
                                                    onClick={() => resetNotification(reminder.id)}
                                                    style={{
                                                        ...buttonStyle,
                                                        padding: '6px 12px',
                                                        fontSize: '12px',
                                                        backgroundColor: '#17a2b8'
                                                    }}
                                                >
                                                    🔄 Сбросить
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => toggleComplete(reminder.id)}
                                                    style={{
                                                        ...buttonStyle,
                                                        padding: '6px 12px',
                                                        fontSize: '12px',
                                                        backgroundColor: '#28a745'
                                                    }}
                                                >
                                                    ✓ Выполнить
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteReminder(reminder.id)}
                                                style={{
                                                    ...deleteButtonStyle,
                                                    padding: '6px 12px',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                🗑️ Удалить
                                            </button>
                                        </div>
                                    </div>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '11px', opacity: 0.5 }}>
                                        Добавлено: {new Date(reminder.createdAt).toLocaleString('ru-RU')}
                                    </p>
                                </div>
                            ))}

                            {completedReminders.length > 0 && (
                                <div style={{ marginTop: '30px' }}>
                                    <h4 style={{ color: '#FFD700', marginBottom: '15px' }}>
                                        ✅ Выполненные напоминания ({completedReminders.length})
                                    </h4>
                                    {completedReminders.map(reminder => (
                                        <div key={reminder.id} style={{
                                            ...reminderCardStyle,
                                            opacity: 0.6
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ margin: '0 0 5px 0', color: '#aaa', textDecoration: 'line-through' }}>
                                                        {reminder.title}
                                                    </h4>
                                                    <p style={{ margin: '0 0 5px 0', fontSize: '14px', opacity: 0.6 }}>
                                                        📅 {formatDateTime(reminder.date, reminder.time)}
                                                    </p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => toggleComplete(reminder.id)}
                                                        style={{
                                                            ...buttonStyle,
                                                            padding: '6px 12px',
                                                            fontSize: '12px',
                                                            backgroundColor: '#6c757d'
                                                        }}
                                                    >
                                                        ↩️ Вернуть
                                                    </button>
                                                    <button
                                                        onClick={() => deleteReminder(reminder.id)}
                                                        style={{
                                                            ...deleteButtonStyle,
                                                            padding: '6px 12px',
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        🗑️ Удалить
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Информационные блоки */}
                <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,215,0,0.1)', borderRadius: '10px' }}>
                    <h4 style={{ color: '#FFD700', marginBottom: '10px' }}>💡 Для чего использовать:</h4>
                    <div style={{ color: 'white', lineHeight: '1.6' }}>
                        • Напоминания о сдаче лабораторных работ<br />
                        • Дедлайны по курсовым проектам<br />
                        • Даты экзаменов и зачетов<br />
                        • Встречи с преподавателями<br />
                        • Важные учебные события
                    </div>
                </div>

                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <h4 style={{ color: '#FFD700', marginBottom: '10px' }}>ℹ️ Как работают уведомления:</h4>
                    <div style={{ color: 'white', lineHeight: '1.6', fontSize: '14px' }}>
                        • {notificationsEnabled ? '✅' : '❌'} Уведомления {notificationsEnabled ? 'включены' : 'отключены'}<br />
                        • 📅 Приходят за 1 минуту до события<br />
                        • 💾 Сохраняются между перезагрузками<br />
                        • 🔕 Можно отключить в любой момент
                    </div>
                </div>
            </div>
        </div>
    );
}