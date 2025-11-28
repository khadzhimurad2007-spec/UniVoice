import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav style={{
            background: '#003366',
            padding: '15px 20px',
            borderBottom: '3px solid #FFD700',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Логотип */}
                <NavLink
                    to="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '18px'
                    }}
                    onClick={closeMenu}
                >
                    <img
                        src="https://academica.ru/images/colleges/2501/1690979742_64ca4d9ecbd28.webp"
                        alt="МАДИ"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            border: '2px solid #FFD700'
                        }}
                        onError={(e) => {
                            e.target.src = 'https://upload.wikimedia.org/wikipedia/ru/thumb/9/9e/MADI_logo.png/200px-MADI_logo.png';
                        }}
                    />
                    <span>UniVoice</span>
                </NavLink>

                {/* Десктопное меню */}
                {!isMobile && (
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <NavLink
                            to="/"
                            style={({ isActive }) => ({
                                padding: '10px 20px',
                                color: isActive ? '#003366' : 'white',
                                background: isActive ? '#FFD700' : 'transparent',
                                borderRadius: '20px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            })}
                        >
                            Главная
                        </NavLink>
                        <NavLink
                            to="/schedule"
                            style={({ isActive }) => ({
                                padding: '10px 20px',
                                color: isActive ? '#003366' : 'white',
                                background: isActive ? '#FFD700' : 'transparent',
                                borderRadius: '20px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            })}
                        >
                            📅 Расписание
                        </NavLink>
                        <NavLink
                            to="/chatgpt"
                            style={({ isActive }) => ({
                                padding: '10px 20px',
                                color: isActive ? '#003366' : 'white',
                                background: isActive ? '#FFD700' : 'transparent',
                                borderRadius: '20px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            })}
                        >
                            AI Помощник
                        </NavLink>
                        <NavLink
                            to="/reminders"
                            style={({ isActive }) => ({
                                padding: '10px 20px',
                                color: isActive ? '#003366' : 'white',
                                background: isActive ? '#FFD700' : 'transparent',
                                borderRadius: '20px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            })}
                        >
                            Напоминания
                        </NavLink>
                    </div>
                )}

                {/* Мобильное гамбургер-меню */}
                {isMobile && (
                    <>
                        <button
                            onClick={toggleMenu}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '24px',
                                cursor: 'pointer',
                                padding: '5px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px'
                            }}
                        >
                            <div style={{ width: '25px', height: '3px', background: 'white' }}></div>
                            <div style={{ width: '25px', height: '3px', background: 'white' }}></div>
                            <div style={{ width: '25px', height: '3px', background: 'white' }}></div>
                        </button>

                        {/* Выпадающее меню */}
                        {isMenuOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                background: '#003366',
                                borderBottom: '3px solid #FFD700',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px'
                            }}>
                                <NavLink
                                    to="/"
                                    style={({ isActive }) => ({
                                        padding: '15px 20px',
                                        color: isActive ? '#003366' : 'white',
                                        background: isActive ? '#FFD700' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        textAlign: 'center'
                                    })}
                                    onClick={closeMenu}
                                >
                                    🏠 Главная
                                </NavLink>
                                <NavLink
                                    to="/schedule"
                                    style={({ isActive }) => ({
                                        padding: '15px 20px',
                                        color: isActive ? '#003366' : 'white',
                                        background: isActive ? '#FFD700' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        textAlign: 'center'
                                    })}
                                    onClick={closeMenu}
                                >
                                    📅 Расписание
                                </NavLink>
                                <NavLink
                                    to="/chatgpt"
                                    style={({ isActive }) => ({
                                        padding: '15px 20px',
                                        color: isActive ? '#003366' : 'white',
                                        background: isActive ? '#FFD700' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        textAlign: 'center'
                                    })}
                                    onClick={closeMenu}
                                >
                                    🤖 AI Помощник
                                </NavLink>
                                <NavLink
                                    to="/reminders"
                                    style={({ isActive }) => ({
                                        padding: '15px 20px',
                                        color: isActive ? '#003366' : 'white',
                                        background: isActive ? '#FFD700' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        textAlign: 'center'
                                    })}
                                    onClick={closeMenu}
                                >
                                    ⏰ Напоминания
                                </NavLink>
                            </div>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;