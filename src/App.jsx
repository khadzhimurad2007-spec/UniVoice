import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useVoice } from './hooks/useVoice';
import Navbar from './components/Navbar';
import VoiceBar from './components/VoiceBar';

import HomePage from './pages/home.jsx';
import SchedulePage from './pages/Schedule.jsx';
import ChatPage from './pages/Chat.jsx';
import RemindersPage from './pages/Reminders.jsx';

export default function App() {
    const navigate = useNavigate();
    const voice = useVoice({ navigate });

    return (
        <div style={{ paddingBottom: 80 }}>
            <Navbar />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/chatgpt" element={<ChatPage />} />
                <Route path="/reminders" element={<RemindersPage />} />
            </Routes>

            <VoiceBar
                isSupported={voice.isSupported}
                isListening={voice.isListening}
                status={voice.status}
                lastPhrase={voice.lastPhrase}
                onStart={voice.startListening}
                onStop={voice.stopListening}
            />
        </div>
    );
}