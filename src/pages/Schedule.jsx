import { useState, useEffect } from "react";

export default function Schedule() {
    // Инициализируем состояние сразу из localStorage
    const [schedule, setSchedule] = useState(() => {
        try {
            const savedSchedule = localStorage.getItem('univoice_schedule');
            return savedSchedule ? JSON.parse(savedSchedule) : [];
        } catch (error) {
            console.error('Ошибка инициализации расписания:', error);
            return [];
        }
    });

    const [newSubject, setNewSubject] = useState("");
    const [day, setDay] = useState("Понедельник");
    const [startTime, setStartTime] = useState("08:30");
    const [endTime, setEndTime] = useState("10:00");
    const [room, setRoom] = useState("");
    const [teacher, setTeacher] = useState("");

    const daysOfWeek = [
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота"
    ];

    // Сохранение расписания в localStorage при каждом изменении
    useEffect(() => {
        localStorage.setItem('univoice_schedule', JSON.stringify(schedule));
    }, [schedule]);

    const addSubject = () => {
        if (!newSubject.trim() || !startTime || !endTime) return;

        if (startTime >= endTime) {
            alert("Время окончания должно быть позже времени начала");
            return;
        }

        const newItem = {
            id: Date.now(),
            subject: newSubject.trim(),
            day,
            startTime,
            endTime,
            room: room.trim(),
            teacher: teacher.trim()
        };

        setSchedule(prev => [...prev, newItem]);
        setNewSubject("");
        setStartTime("08:30");
        setEndTime("10:00");
        setRoom("");
        setTeacher("");
    };

    const deleteSubject = (id) => {
        setSchedule(prev => prev.filter(item => item.id !== id));
    };

    const getSubjectsByDay = (dayName) => {
        return schedule
            .filter(item => item.day === dayName)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    // Функция для получения статуса занятия
    const getClassStatus = (item) => {
        const now = new Date();
        const today = now.toLocaleString('ru-RU', { weekday: 'long' });

        // Приводим к правильному регистру для сравнения
        const currentDay = today.charAt(0).toUpperCase() + today.slice(1);

        if (currentDay !== item.day) return "not_today";

        const [startHour, startMinute] = item.startTime.split(':').map(Number);
        const [endHour, endMinute] = item.endTime.split(':').map(Number);

        const classStart = new Date();
        classStart.setHours(startHour, startMinute, 0, 0);

        const classEnd = new Date();
        classEnd.setHours(endHour, endMinute, 0, 0);

        if (now < classStart) return "not_started";
        if (now > classEnd) return "finished";
        return "in_progress";
    };

    // Очистка всего расписания
    const clearAllSchedule = () => {
        if (window.confirm("Вы уверены, что хотите удалить всё расписание?")) {
            setSchedule([]);
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #003366 0%, #004080 100%)',
        padding: '40px 20px',
        color: 'white'
    };

    const contentStyle = {
        maxWidth: '1200px',
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

    const inputStyle = {
        padding: '12px',
        fontSize: '14px',
        border: '2px solid #FFD700',
        borderRadius: '8px',
        marginRight: '8px',
        marginBottom: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: '#003366',
        width: '100%'
    };

    const selectStyle = {
        ...inputStyle,
        minWidth: '150px'
    };

    const timeInputStyle = {
        ...inputStyle,
        width: '120px'
    };

    const buttonStyle = {
        padding: '12px 24px',
        fontSize: '14px',
        backgroundColor: '#FFD700',
        color: '#003366',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: '8px'
    };

    const clearButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#dc3545',
        color: 'white'
    };

    const dayCardStyle = {
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px',
        color: '#333',
        border: '2px solid #FFD700'
    };

    const subjectItemStyle = {
        background: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '10px',
        position: 'relative'
    };

    const deleteButtonStyle = {
        background: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '5px 10px',
        cursor: 'pointer',
        fontSize: '12px',
        marginLeft: '10px'
    };

    const subjectContentStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    };

    const statusBadgeStyle = (status) => {
        const baseStyle = {
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            marginLeft: '8px'
        };

        switch (status) {
            case 'in_progress':
                return { ...baseStyle, backgroundColor: '#d4edda', color: '#155724' };
            case 'finished':
                return { ...baseStyle, backgroundColor: '#e2e3e5', color: '#383d41' };
            case 'not_started':
                return { ...baseStyle, backgroundColor: '#fff3cd', color: '#856404' };
            default:
                return { ...baseStyle, backgroundColor: '#e2e3e5', color: '#383d41' };
        }
    };

    return (
        <div style={containerStyle}>
            <div style={contentStyle}>
                <h1 style={titleStyle}>📅 Расписание</h1>

                {/* Форма добавления занятия */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '20px',
                    marginBottom: '30px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Добавить занятие</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                        <input
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="Название предмета"
                            style={inputStyle}
                        />

                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            style={selectStyle}
                        >
                            {daysOfWeek.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                style={timeInputStyle}
                            />
                            <span style={{ color: '#FFD700' }}>—</span>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                style={timeInputStyle}
                            />
                        </div>

                        <input
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            placeholder="Аудитория"
                            style={inputStyle}
                        />

                        <input
                            value={teacher}
                            onChange={(e) => setTeacher(e.target.value)}
                            placeholder="Преподаватель"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                            onClick={addSubject}
                            disabled={!newSubject.trim() || !startTime || !endTime}
                            style={{
                                ...buttonStyle,
                                opacity: (!newSubject.trim() || !startTime || !endTime) ? 0.6 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (newSubject.trim() && startTime && endTime) {
                                    e.target.style.transform = 'scale(1.05)';
                                }
                            }}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            ➕ Добавить занятие
                        </button>

                        {schedule.length > 0 && (
                            <button
                                onClick={clearAllSchedule}
                                style={clearButtonStyle}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                🗑️ Очистить всё
                            </button>
                        )}
                    </div>
                </div>

                {/* Расписание по дням недели */}
                <div style={{ marginTop: '30px' }}>
                    {daysOfWeek.map(dayName => {
                        const daySubjects = getSubjectsByDay(dayName);

                        return (
                            <div key={dayName} style={dayCardStyle}>
                                <h3 style={{
                                    color: '#003366',
                                    marginBottom: '15px',
                                    paddingBottom: '10px',
                                    borderBottom: '2px solid #FFD700'
                                }}>
                                    {dayName} {daySubjects.length > 0 && `(${daySubjects.length})`}
                                </h3>

                                {daySubjects.length === 0 ? (
                                    <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
                                        Занятий нет
                                    </p>
                                ) : (
                                    daySubjects.map(item => {
                                        const status = getClassStatus(item);
                                        const statusText = {
                                            'not_today': '',
                                            'not_started': 'Не началось',
                                            'in_progress': 'Идет сейчас',
                                            'finished': 'Завершено'
                                        }[status];

                                        return (
                                            <div key={item.id} style={subjectItemStyle}>
                                                <div style={subjectContentStyle}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                                            <strong style={{ color: '#003366', fontSize: '16px' }}>
                                                                {item.subject}
                                                            </strong>
                                                            {statusText && (
                                                                <span style={statusBadgeStyle(status)}>
                                                                    {statusText}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div style={{ fontSize: '14px', color: '#666' }}>
                                                            <div>⏰ {item.startTime} - {item.endTime}</div>
                                                            {item.room && <div>🏫 Аудитория: {item.room}</div>}
                                                            {item.teacher && <div>👨‍🏫 Преподаватель: {item.teacher}</div>}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteSubject(item.id)}
                                                        style={deleteButtonStyle}
                                                        title="Удалить занятие"
                                                    >
                                                        ❌
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Инструкция */}
                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    background: 'rgba(255,215,0,0.1)',
                    borderRadius: '10px'
                }}>
                    <h4 style={{ color: '#FFD700', marginBottom: '10px' }}>ℹ️ Как использовать расписание:</h4>
                    <ul style={{ color: 'white', lineHeight: '1.6' }}>
                        <li>✅ <strong>Расписание сохраняется автоматически</strong> - даже после перезагрузки страницы</li>
                        <li>Добавляйте занятия с помощью формы выше</li>
                        <li>Устанавливайте любое удобное время начала и окончания</li>
                        <li>Цветные метки показывают статус занятий на сегодня</li>
                        <li>Удаляйте ненужные занятия кнопкой "❌"</li>
                        <li>Используйте "Очистить всё" для полного сброса расписания</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}