import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div>
            <h1>Главная страница UniVoice</h1>
            <button>Войти через Google</button>

            <nav style={{ marginTop: 20 }}>
                <Link to="/schedule">📅 Расписание</Link><br />
                <Link to="/chatgpt">💬 Чат GPT</Link><br />
                <Link to="/reminders">⏰ Напоминания</Link>
            </nav>
        </div>
    );
}
