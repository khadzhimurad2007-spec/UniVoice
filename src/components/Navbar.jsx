import React from 'react';
import { NavLink } from 'react-router-dom';

const navStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 40px',
    backgroundColor: '#003366',
    borderBottom: '3px solid #FFD700',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
};

const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    textDecoration: 'none'
};

const logoImageStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    border: '2px solid #FFD700'
};

const linksContainerStyle = {
    display: 'flex',
    gap: '15px'
};

const linkStyle = {
    padding: '12px 25px',
    textDecoration: 'none',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: '14px',
    borderRadius: '25px',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const activeStyle = {
    color: '#003366',
    backgroundColor: '#FFD700',
    boxShadow: '0 4px 8px rgba(255,215,0,0.3)'
};

export default function NavBar() {
    return (
        <nav style={navStyle}>
            <NavLink to="/" style={logoStyle}>
                <img 
                    src="https://upload.wikimedia.org/wikipedia/ru/thumb/9/9e/MADI_logo.png/200px-MADI_logo.png" 
                    alt="МАДИ" 
                    style={logoImageStyle}
                    onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCA0NSA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ1IiBoZWlnaHQ9IjQ1IiByeD0iMjIiIGZpbGw9IiMwMDMzNjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjkiIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAyOSAyOSIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik03IDE0LjVIMjIiIHN0cm9rZT0iI0ZGRDcwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTE0LjUgN1YyMiIgc3Ryb2tlPSIjRkZENzAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4KPC9zdmc+';
                    }}
                />
                <span>МАДИ | UniVoice</span>
            </NavLink>
            
            <div style={linksContainerStyle}>
                <NavLink 
                    to="/" 
                    style={({ isActive }) => 
                        isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                    }
                >
                    Главная
                </NavLink>
                <NavLink 
                    to="/schedule" 
                    style={({ isActive }) => 
                        isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                    }
                >
                    Расписание
                </NavLink>
                <NavLink 
                    to="/chatgpt" 
                    style={({ isActive }) => 
                        isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                    }
                >
                    AI Помощник
                </NavLink>
                <NavLink 
                    to="/reminders" 
                    style={({ isActive }) => 
                        isActive ? { ...linkStyle, ...activeStyle } : linkStyle
                    }
                >
                    Напоминания
                </NavLink>
            </div>
        </nav>
    );
}