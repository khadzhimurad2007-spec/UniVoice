// src/services/ReminderService.js

let reminders = [];

// Загружаем напоминания при инициализации
try {
    reminders = JSON.parse(localStorage.getItem('madi-reminders') || '[]');
} catch (error) {
    console.error('Error loading reminders:', error);
    reminders = [];
}

export function addReminder(text, dateTime) {
    try {
        const timestamp = new Date(dateTime).getTime();
        const id = Date.now().toString();
        const reminder = {
            id,
            text,
            timestamp,
            date: new Date(dateTime).toISOString().split('T')[0],
            time: new Date(dateTime).toTimeString().slice(0, 5),
            completed: false,
            notified: false,
            createdAt: new Date().toISOString()
        };

        reminders.push(reminder);
        saveReminders();
        scheduleNotification(reminder);

        console.log('Reminder added:', reminder);
        return reminder;
    } catch (error) {
        console.error('Error adding reminder:', error);
        throw error;
    }
}

export function getReminders() {
    return [...reminders];
}

export function deleteReminder(id) {
    reminders = reminders.filter(reminder => reminder.id !== id);
    saveReminders();
}

function saveReminders() {
    try {
        localStorage.setItem('madi-reminders', JSON.stringify(reminders));
    } catch (error) {
        console.error('Error saving reminders:', error);
    }
}

function scheduleNotification(reminder) {
    const now = Date.now();
    const delay = reminder.timestamp - now - 60000; // за 1 минуту до события

    if (delay <= 0) {
        showNotification(reminder.text);
        return;
    }

    setTimeout(() => {
        showNotification(reminder.text);
        // Помечаем как уведомленное
        const reminderIndex = reminders.findIndex(r => r.id === reminder.id);
        if (reminderIndex !== -1) {
            reminders[reminderIndex].notified = true;
            saveReminders();
        }
    }, delay);
}

function showNotification(message) {
    if (Notification.permission === "granted") {
        new Notification("⏰ Напоминание UniVoice", {
            body: message,
            icon: '/favicon.ico'
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((perm) => {
            if (perm === "granted") {
                new Notification("⏰ Напоминание UniVoice", {
                    body: message,
                    icon: '/favicon.ico'
                });
            }
        });
    }
}