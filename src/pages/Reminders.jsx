import { useState, useEffect } from "react";
import {
    db,
    collection,
    addDoc,
    doc,
    deleteDoc,
    query,
    orderBy,
    onSnapshot,
} from "../firebase";

export default function Reminders() {
    const [text, setText] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "reminders"), orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));
            setReminders(list);
        });
        return () => unsubscribe();
    }, []);

    async function addReminder() {
        if (!text.trim() || !dateTime) return;

        const dt = new Date(dateTime);
        await addDoc(collection(db, "reminders"), {
            text,
            timestamp: dt.getTime(),
            createdAt: Date.now(),
        });

        setText("");
        setDateTime("");
    }

    async function deleteReminder(reminderId) {
        await deleteDoc(doc(db, "reminders", reminderId));
    }

    // Проверка каждые 30 секунд
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            reminders.forEach((r) => {
                if (Math.abs(r.timestamp - now) < 30000) {
                    showNotification(r.text);
                }
            });
        }, 30000);

        return () => clearInterval(interval);
    }, [reminders]);

    function showNotification(message) {
        if (Notification.permission === "granted") {
            new Notification("Напоминание", { body: message });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((perm) => {
                if (perm === "granted") {
                    new Notification("Напоминание", { body: message });
                }
            });
        }
    }

    return (
        <div>
            <h1>Напоминания</h1>

            <div className="reminders-form">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Текст напоминания"
                />
                <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                />
                <button onClick={addReminder}>Добавить</button>
            </div>

            <div className="reminders-list">
                {reminders.length === 0 ? (
                    <p>Напоминаний пока нет</p>
                ) : (
                    <ul>
                        {reminders.map((r) => (
                            <li key={r.id} className="reminder-item">
                                <div>
                                    <b>{r.text}</b>
                                    <div>{new Date(r.timestamp).toLocaleString()}</div>
                                </div>
                                <button onClick={() => deleteReminder(r.id)}>Удалить</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
