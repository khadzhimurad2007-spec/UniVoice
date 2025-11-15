export const commandCatalog = [
    {
        id: 'help',
        matchers: ['помощь', 'что ты умеешь', 'какие команды', 'справка'],
        handler: async ({ speak }) => {
            speak(
                'Доступные команды: открой главную, открой расписание, открой чат, открой напоминания, ' +
                'создай событие, поставь напоминание, старт, стоп, помощь.'
            );
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
        matchers: ['открой чат', 'чат gpt', 'чат', 'чатгпт'],
        handler: async ({ navigate, speak }) => {
            navigate('/chatgpt');
            speak('Открываю чат GPT.');
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
        matchers: ['старт', 'начать', 'включи микрофон'],
        handler: async ({ startListening, speak }) => {
            startListening();
            speak('Слушаю.');
        }
    },
    {
        id: 'stop',
        matchers: ['стоп', 'остановить', 'выключи микрофон', 'хватит'],
        handler: async ({ stopListening, speak }) => {
            stopListening();
            speak('Остановила прослушивание.');
        }
    },
    {
        id: 'createEvent',
        matchers: ['создай событие', 'новое событие', 'добавь встречу', 'собрание'],
        handler: async ({ phrase, speak, createCalendarEvent }) => {
            await createCalendarEvent({
                title: 'Событие',
                when: 'завтра 10:00',
                sourcePhrase: phrase
            });
            speak('Создала событие завтра в 10:00.');
        }
    },
    {
        id: 'reminder',
        matchers: ['поставь напоминание', 'напомни', 'напоминание'],
        handler: async ({ phrase, speak, createReminder }) => {
            try {
                await createReminder({
                    title: 'Напоминание',
                    when: 'сегодня 18:00',
                    sourcePhrase: phrase
                });
                speak('Поставила напоминание на сегодня 18:00.');
            } catch (e) {
                console.error(e);
                speak('Не удалось добавить напоминание.');
            }
        }
    }
];
