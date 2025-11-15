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
    const cmd = findCommandByRule(phrase);
    if (cmd) {
        return cmd.handler(context);
    }
    // Если нет точного совпадения — попробуем NLU (если подключён)
    if (context.nlu) {
        const intent = await context.nlu.classifyIntent(phrase);
        if (intent && intent.handlerId) {
            const target = commandCatalog.find(c => c.id === intent.handlerId);
            if (target) return target.handler(context);
        }
    }
    context.speak('Не уверена, что вы имели в виду. Скажите: «помощь» — чтобы узнать команды.');
}
