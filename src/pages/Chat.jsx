// src/pages/Chat.jsx
import { useEffect, useRef, useState } from "react";
import { askGPT } from "../api/gpt";

export default function Chat() {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading, error]);

    async function handleSend() {
        if (!question.trim() || loading) return;

        setError("");
        const userMsg = { role: "user", content: question };
        setMessages((prev) => [...prev, userMsg]);
        setQuestion("");

        try {
            setLoading(true);
            const answer = await askGPT(userMsg.content);
            const assistantMsg = { role: "assistant", content: answer };
            setMessages((prev) => [...prev, assistantMsg]);
        } catch (e) {
            setError(e.message || "Ошибка запроса к GPT.");
        } finally {
            setLoading(false);
        }
    }

    function handleEnter(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div>
            <h1>GPT Чат</h1>

            <div className="chat-window">
                {messages.map((m, i) => (
                    <div key={i} className={m.role === "user" ? "user-msg" : "gpt-msg"}>
                        {m.content}
                    </div>
                ))}
                {loading && <div className="gpt-msg loading">Генерация ответа…</div>}
                <div ref={endRef} />
            </div>

            {error && <div className="error">{error}</div>}

            <div className="chat-input-row">
                <textarea
                    rows={2}
                    placeholder="Введите вопрос и нажмите Enter"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleEnter}
                />
                <button onClick={handleSend} disabled={loading || !question.trim()}>
                    {loading ? "Отправка..." : "Отправить"}
                </button>
            </div>
        </div>
    );
}
