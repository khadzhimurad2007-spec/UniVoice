import { commandCatalog } from './commandCatalog';

export function findCommandByRule(phrase) {
    const normalized = (phrase || '').toLowerCase();
    for (const cmd of commandCatalog) {
        if (cmd.matchers.some(m => normalized.includes(m))) {
            return cmd;
        }
    }
    return null;
}

export async function routeCommand({ phrase, context }) {
    // Если фраза слишком короткая - игнорируем
    if (!phrase || phrase.trim().length < 2) return;

    const cmd = findCommandByRule(phrase);
    if (cmd) {
        await cmd.handler({ ...context, phrase });
        return;
    }

    // Если нет точного совпадения — пробуем NLU (если подключён)
    if (context.nlu) {
        const intent = await context.nlu.classifyIntent(phrase);
        if (intent && intent.handlerId) {
            const target = commandCatalog.find(c => c.id === intent.handlerId);
            if (target) {
                await target.handler({ ...context, phrase });
                return;
            }
        }
    }

    // Обрабатываем как вопрос к GPT
    const generalQuestionCmd = commandCatalog.find(c => c.id === 'generalQuestion');
    if (generalQuestionCmd) {
        await generalQuestionCmd.handler({ ...context, phrase });
        return;
    }

    // Fallback ответ
    context.speak('Я не могу это сделать. Вы можете задать вопрос или сказать "помощь" для списка команд.');
}