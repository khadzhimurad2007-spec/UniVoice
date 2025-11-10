import { useState } from "react";

export default function Schedule() {
    const [group, setGroup] = useState("");
    const [html, setHtml] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
            setError("Ошибка загрузки. Проверь подключение или попробуй позже.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Расписание МАДИ</h1>
            <input
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="Введите группу (например, БИС-31)"
            />
            <button onClick={loadSchedule} disabled={loading}>
                {loading ? "Загрузка..." : "Показать"}
            </button>

            {error && <div className="error">{error}</div>}

            {html && (
                <div
                    className="schedule-html"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            )}
        </div>
    );
}
