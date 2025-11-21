// Service Worker для фоновых уведомлений
const CACHE_NAME = 'madi-reminders-v2';

self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('🔧 Service Worker activated');
    self.clients.claim();
});

// Фоновая проверка напоминаний
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'START_BACKGROUND_CHECK') {
        console.log('🔧 Starting background check with reminders:', event.data.reminders.length);
        startBackgroundCheck(event.data.reminders);
    }
});

function startBackgroundCheck(reminders) {
    console.log('🔧 Background check initialized');

    // Проверяем сразу при старте
    checkReminders(reminders);

    // Устанавливаем интервал проверки каждые 30 секунд
    setInterval(() => {
        checkReminders(reminders);
    }, 30000);
}

function checkReminders(reminders) {
    const now = new Date();
    console.log('🔧 Background check running at:', now.toLocaleTimeString());

    let updated = false;
    const updatedReminders = [...reminders];

    updatedReminders.forEach((reminder, index) => {
        if (reminder.completed || reminder.notified) return;
        if (!reminder.date) return;

        try {
            const reminderDateTime = new Date(`${reminder.date}T${reminder.time || '23:59'}`);
            const diff = reminderDateTime - now;

            console.log(`🔧 Checking: ${reminder.title}, diff: ${Math.round(diff / 1000)}s`);

            // Уведомление за 1 минуту до события
            if (diff > 0 && diff <= 60000) {
                console.log('🎯 Background: Triggering notification for:', reminder.title);

                self.registration.showNotification(`⏰ Напоминание МАДИ: ${reminder.title}`, {
                    body: reminder.description || `Время: ${formatDateTime(reminder.date, reminder.time)}`,
                    icon: '/favicon.ico',
                    tag: `reminder-${reminder.id}`,
                    requireInteraction: true,
                    badge: '/favicon.ico'
                });

                // Помечаем как уведомленное
                updatedReminders[index].notified = true;
                updated = true;

                // Сохраняем в localStorage через главный поток
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => {
                        client.postMessage({
                            type: 'REMINDER_TRIGGERED',
                            reminderId: reminder.id,
                            updatedReminders: updatedReminders
                        });
                    });
                });
            }
        } catch (error) {
            console.error('🔧 Background error:', error);
        }
    });

    if (updated) {
        console.log('🔧 Reminders updated, saving...');
    }
}

function formatDateTime(dateString, timeString) {
    const date = new Date(`${dateString}T${timeString}`);
    return date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
    console.log('🔧 Notification clicked');
    event.notification.close();

    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then(clients => {
            // Ищем открытую вкладку с напоминаниями
            for (const client of clients) {
                if (client.url.includes('/reminders') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Если вкладка не найдена, открываем новую
            if (self.clients.openWindow) {
                return self.clients.openWindow('/reminders');
            }
        })
    );
});

self.addEventListener('notificationclose', (event) => {
    console.log('🔧 Notification closed');
});