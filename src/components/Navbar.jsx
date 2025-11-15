import React from 'react';
import { NavLink } from 'react-router-dom';

const linkStyle = {
    padding: '8px 16px',
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold'
};

const activeStyle = {
    color: '#28a745',
    borderBottom: '2px solid #28a745'
};

export default function Navbar() {
    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
            padding: '12px 0',
            borderBottom: '1px solid #ddd',
            marginBottom: 16
        }}>
            <NavLink to="/" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>Главная</NavLink>
            <NavLink to="/schedule" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>Расписание</NavLink>
            <NavLink to="/chatgpt" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>Чат GPT</NavLink>
            <NavLink to="/reminders" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>Напоминания</NavLink>
        </nav>
    );
}
