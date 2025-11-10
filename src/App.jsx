import { NavLink, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Chat from "./pages/Chat";
import Reminders from "./pages/Reminders";

export default function App() {
    const getLinkClass = ({ isActive }) =>
        isActive ? "nav-link active" : "nav-link";

    return (
        <div className="container">
            <header>
                <h1>UniVoice</h1>
                <nav className="navbar">
                    <NavLink to="/" end className={getLinkClass}>
                        Главная
                    </NavLink>
                    <NavLink to="/schedule" className={getLinkClass}>
                        Расписание
                    </NavLink>
                    <NavLink to="/chat" className={getLinkClass}>
                        Чат
                    </NavLink>
                    <NavLink to="/reminders" className={getLinkClass}>
                        Напоминания
                    </NavLink>
                </nav>
            </header>

            <main className="content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/reminders" element={<Reminders />} />
                </Routes>
            </main>
        </div>
    );
}
