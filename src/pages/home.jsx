import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 51, 102, 0.9)), url("https://cache.sys3.ru/provuz-back/organizations/216/1xVO9wx93V00O3U1M9OD0axm7sBsCt7wuRFMDyG3.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '20px'
    };

    const headerStyle = {
        marginBottom: '50px',
        background: 'rgba(0, 0, 0, 0.6)',
        padding: '30px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
    };

    const titleStyle = {
        fontSize: '3.5rem',
        fontWeight: 'bold',
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        color: '#FFD700'
    };

    const subtitleStyle = {
        fontSize: '1.8rem',
        marginBottom: '10px',
        opacity: '0.9'
    };

    const instituteStyle = {
        fontSize: '1.3rem',
        marginBottom: '10px',
        opacity: '0.8',
        fontStyle: 'italic'
    };

    const navStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '25px',
        maxWidth: '1000px',
        width: '100%'
    };

    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '15px',
        padding: '30px 20px',
        textDecoration: 'none',
        color: 'white',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    };

    const iconStyle = {
        fontSize: '3rem',
        marginBottom: '15px'
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={titleStyle}>UniVoice</h1>
                <p style={subtitleStyle}>Голосовой ассистент</p>
                <p style={instituteStyle}>Московский автомобильно-дорожный государственный технический университет</p>
                <p style={{fontSize: '1.1rem', opacity: 0.7}}>МАДИ (ГТУ)</p>
            </div>

            <div style={navStyle}>
                <Link 
                    to="/schedule" 
                    style={cardStyle}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-10px)';
                        e.target.style.background = 'rgba(255, 215, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                >
                    <span style={iconStyle}>📅</span>
                    <h3 style={{margin: '10px 0', fontSize: '1.4rem'}}>Расписание</h3>
                    <p style={{margin: 0, opacity: 0.9}}>Просмотр учебного расписания групп</p>
                </Link>

                <Link 
                    to="/chatgpt" 
                    style={cardStyle}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-10px)';
                        e.target.style.background = 'rgba(255, 215, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                >
                    <span style={iconStyle}>🤖</span>
                    <h3 style={{margin: '10px 0', fontSize: '1.4rem'}}>AI Помощник</h3>
                    <p style={{margin: 0, opacity: 0.9}}>Интеллектуальный помощник для учебы</p>
                </Link>

                <Link 
                    to="/reminders" 
                    style={cardStyle}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-10px)';
                        e.target.style.background = 'rgba(255, 215, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                >
                    <span style={iconStyle}>⏰</span>
                    <h3 style={{margin: '10px 0', fontSize: '1.4rem'}}>Напоминания</h3>
                    <p style={{margin: 0, opacity: 0.9}}>Управление задачами и событиями</p>
                </Link>
            </div>

            <div style={{marginTop: '50px', opacity: 0.7, background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '10px'}}>
                <p>Используйте голосовые команды для удобной навигации</p>
            </div>
        </div>
    );
}