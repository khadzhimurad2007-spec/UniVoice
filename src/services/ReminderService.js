// src/services/ReminderService.js

const reminders = []; // простое хранилище в памяти

export function addReminder(text, dateTime) {
  const timestamp = new Date(dateTime).getTime();
  const id = Date.now().toString();
  const reminder = { id, text, timestamp };
  reminders.push(reminder);

  scheduleNotification(reminder);
  return reminder;
}

function scheduleNotification(reminder) {
  const now = Date.now();
  const delay = reminder.timestamp - now;

  if (delay <= 0) {
    showNotification(reminder.text);
    return;
  }

  setTimeout(() => {
    showNotification(reminder.text);
  }, delay);
}

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
