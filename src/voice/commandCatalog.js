import { addReminder } from '../services/ReminderService';
import { addScheduleItem } from '../services/ScheduleService';
import { askGPT } from '../services/gpt';

export const commandCatalog = [
    {
        id: 'help',
        matchers: ['помощь', 'что ты умеешь', 'какие команды', 'справка'],
        handler: async ({ speak }) => {
            const helpText = `
Доступные команды:
📅 Навигация: открой главную, расписание, чат, напоминания
⏰ Напоминания: "поставь напоминание завтра в 15:30 сдать лабу"
📚 Расписание: "добавь математику в понедельник с 10:00 до 11:30"
🎤 Управление: старт, стоп, помощь
💬 Вопросы: просто задайте любой вопрос
Для активации скажите "Юни" или "Юнивойс"
            `.trim();
            speak(helpText);
        }
    },
    {
        id: 'openHome',
        matchers: ['на главную', 'открой главную', 'домой', 'главная'],
        handler: async ({ navigate, speak }) => {
            navigate('/');
            speak('Открываю главную страницу.');
        }
    },
    {
        id: 'openSchedule',
        matchers: ['открой расписание', 'расписание', 'покажи расписание'],
        handler: async ({ navigate, speak }) => {
            navigate('/schedule');
            speak('Открываю расписание.');
        }
    },
    {
        id: 'openChat',
        matchers: ['открой чат', 'чат gpt', 'чат', 'чатгпт', 'помощник'],
        handler: async ({ navigate, speak }) => {
            navigate('/chatgpt');
            speak('Открываю чат помощника.');
        }
    },
    {
        id: 'openReminders',
        matchers: ['открой напоминания', 'напоминания', 'покажи напоминания'],
        handler: async ({ navigate, speak }) => {
            navigate('/reminders');
            speak('Открываю напоминания.');
        }
    },
    {
        id: 'start',
        matchers: ['старт', 'начать', 'включи микрофон', 'проснись'],
        handler: async ({ startListening, speak }) => {
            startListening();
            speak('Слушаю вас.');
        }
    },
    {
        id: 'stop',
        matchers: ['стоп', 'остановить', 'выключи микрофон', 'хватит', 'замолчи'],
        handler: async ({ stopListening, speak }) => {
            stopListening();
            speak('Выключаю микрофон.');
        }
    },
    // НАПОМИНАНИЯ С ПРАВИЛЬНЫМ ПАРСИНГОМ ВРЕМЕНИ
    {
        id: 'createReminder',
        matchers: ['поставь напоминание', 'напомни', 'напоминание', 'создай напоминание'],
        handler: async ({ phrase, speak }) => {
            try {
                const parsed = parseReminderPhrase(phrase);

                if (!parsed.text) {
                    speak('Что именно вам напомнить? Скажите, например: "Поставь напоминание завтра в 15:00 сдать лабораторную"');
                    return;
                }

                const reminder = addReminder(parsed.text, parsed.dateTime);
                speak(`Напоминание "${parsed.text}" установлено на ${formatReminderTime(parsed.dateTime)}.`);
            } catch (error) {
                console.error('Reminder creation error:', error);
                speak('Не удалось создать напоминание. Попробуйте еще раз.');
            }
        }
    },
    // РАСПИСАНИЕ С РАБОЧИМ ДОБАВЛЕНИЕМ
    {
        id: 'addToSchedule',
        matchers: ['добавь занятие', 'в расписание', 'поставь предмет', 'добавь в расписание'],
        handler: async ({ phrase, speak }) => {
            try {
                const parsed = parseSchedulePhrase(phrase);

                if (!parsed.subject) {
                    speak('Какой предмет добавить в расписание? Скажите, например: "Добавь математику в понедельник с 10:00 до 11:30"');
                    return;
                }

                const scheduleItem = addScheduleItem(parsed);
                speak(`Предмет "${parsed.subject}" добавлен в расписание на ${parsed.day} с ${parsed.startTime} до ${parsed.endTime}.`);
            } catch (error) {
                console.error('Schedule addition error:', error);
                speak('Не удалось добавить занятие в расписание. Проверьте, правильно ли вы указали время.');
            }
        }
    },
    // ОБЩИЕ ВОПРОСЫ
    {
        id: 'generalQuestion',
        matchers: [],
        handler: async ({ phrase, speak }) => {
            try {
                speak('Думаю над ответом...');
                const response = await askGPT(phrase);
                speak(response);
            } catch (error) {
                console.error('GPT question error:', error);
                speak('Извините, не могу ответить на этот вопрос прямо сейчас. Попробуйте позже.');
            }
        }
    }
];

// 🔥 УЛУЧШЕННЫЙ ПАРСИНГ НАПОМИНАНИЙ
function parseReminderPhrase(phrase) {
    const normalized = phrase.toLowerCase();

    let dateTime = new Date();
    let text = '';

    // Извлекаем текст напоминания (убираем команды и временные выражения)
    text = normalized
        .replace(/поставь напоминание|напомни|напоминание|создай напоминание/g, '')
        .replace(/на|в|завтра|сегодня|послезавтра|утра|вечера|дня|ночи/g, '')
        .replace(/\d{1,2}[:.]?\d{0,2}/g, '') // убираем время
        .replace(/\s+/g, ' ')
        .trim();

    // Парсим дату
    if (normalized.includes('завтра')) {
        dateTime.setDate(dateTime.getDate() + 1);
    } else if (normalized.includes('послезавтра')) {
        dateTime.setDate(dateTime.getDate() + 2);
    }

    // Парсим время
    const timeMatch = normalized.match(/(\d{1,2})[:.]?(\d{0,2})?\s*(утра|вечера|дня|ночи)?/);
    if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        let minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const period = timeMatch[3];

        // Корректируем время в зависимости от периода
        if (period === 'вечера' || period === 'ночи') {
            if (hours < 12) hours += 12;
        } else if (period === 'утра' && hours === 12) {
            hours = 0;
        }

        // Проверяем корректность времени
        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
            dateTime.setHours(hours, minutes, 0, 0);
        } else {
            // Если время некорректное, ставим на 12:00
            dateTime.setHours(12, 0, 0, 0);
        }
    } else {
        // Если время не указано, ставим на 18:00
        dateTime.setHours(18, 0, 0, 0);
    }

    return {
        text: text || 'Напоминание',
        dateTime: dateTime.toISOString()
    };
}

// 🔥 УЛУЧШЕННЫЙ ПАРСИНГ РАСПИСАНИЯ
function parseSchedulePhrase(phrase) {
    const normalized = phrase.toLowerCase();

    // Дни недели
    const days = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    const day = days.find(d => normalized.includes(d)) || 'понедельник';

    // Извлекаем название предмета
    let subject = normalized
        .replace(/добавь|в расписание|поставь|предмет|занятие/g, '')
        .replace(new RegExp(days.join('|'), 'g'), '')
        .replace(/\d{1,2}[:.]?\d{0,2}/g, '')
        .replace(/с|до|в/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    // Парсим время
    let startTime = '10:00';
    let endTime = '11:30';

    const timeMatches = normalized.matchAll(/(\d{1,2})[:.]?(\d{0,2})/g);
    const times = [];
    for (const match of timeMatches) {
        let hours = parseInt(match[1]);
        let minutes = match[2] ? parseInt(match[2]) : 0;
        times.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    }

    if (times.length >= 2) {
        startTime = times[0];
        endTime = times[1];
    } else if (times.length === 1) {
        startTime = times[0];
        // Добавляем 1.5 часа к начальному времени
        const [hours, minutes] = startTime.split(':').map(Number);
        let endHours = hours + 1;
        let endMinutes = minutes + 30;
        if (endMinutes >= 60) {
            endHours += 1;
            endMinutes -= 60;
        }
        endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    }

    return {
        subject: subject || 'Новый предмет',
        day: day,
        startTime: startTime,
        endTime: endTime,
        room: '',
        teacher: ''
    };
}

function formatReminderTime(dateTime) {
    return new Date(dateTime).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });
}