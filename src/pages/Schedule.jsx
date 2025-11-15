import { useState } from "react";

export default function Schedule() {
    const [group, setGroup] = useState("");
    const [html, setHtml] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
        padding: '15px',
        fontSize: '16px',
        border: '2px solid #FFD700',
        borderRadius: '10px',
        marginRight: '10px',
        width: '300px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
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
        transition: 'all 0.3s ease'
    };

    const loadingStyle = {
        textAlign: 'center',
        fontSize: '18px',
        color: '#FFD700',
        margin: '20px 0'
    };

    const errorStyle = {
        color: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        padding: '15px',
        borderRadius: '10px',
        margin: '20px 0',
        border: '1px solid #ff6b6b'
    };

    const scheduleStyle = {
        marginTop: '30px',
        background: 'white',
        borderRadius: '10px',
        padding: '20px',
        color: '#333',
        overflow: 'auto'
    };

    async function loadSchedule() {
        if (!group.trim()) return;
        setLoading(true);
        setError("");
        setHtml("");

        const madiUrl = `https://raspisanie.madi.ru/tplan/?group=${encodeURIComponent(group.trim())}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(madiUrl)}`;

        try {
            const res = await fetch(proxyUrl);
            const text = await res.text();
            if (text.includes("<table")) {
                setHtml(text);
            } else {
                setError("Расписание не найдено или формат изменился.");   
            }
        } catch (e) {
            setError("Ошибка загрузки. Проверьте подключение или попробуйте позже.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={containerStyle}>
            <div style={contentStyle}>
                <h1 style={titleStyle}>📅 Расписание МАДИ</h1>
                
                <div style={{textAlign: 'center', marginBottom: '30px'}}>
                    <input
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                        placeholder="Введите группу (например, АСУ-31)"
                        style={inputStyle}
                    />
                    <button 
                        onClick={loadSchedule} 
                        disabled={loading}
                        style={buttonStyle}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        {loading ? "Загрузка..." : "Показать расписание"}
                    </button>
                </div>

                {error && <div style={errorStyle}>{error}</div>}

                {loading && <div style={loadingStyle}>⏳ Загружаем расписание...</div>}

                {html && (
                    <div style={scheduleStyle}>
                        <h3 style={{color: '#003366', marginBottom: '15px'}}>Расписание для группы: {group}</h3>
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                    </div>
                )}

                <div style={{marginTop: '30px', padding: '20px', background: 'rgba(255,215,0,0.1)', borderRadius: '10px'}}>
                    <h4 style={{color: '#FFD700', marginBottom: '10px'}}>ℹ️ Как использовать:</h4>
                    <ul style={{color: 'white', lineHeight: '1.6'}}>
                        <li>Введите номер вашей учебной группы</li>
                        <li>Нажмите "Показать расписание"</li>
                        <li>Расписание загрузится с официального сайта МАДИ</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}