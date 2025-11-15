import OpenAI from 'openai';

const systemPrompt = `
Ты — маршрутизатор намерений для голосового ассистента UniVoice на русском.
Верни JSON с полями: { "handlerId": "<id или null>" }.
handlerId из списка: help, openCalendar, start, stop, createEvent, reminder.
Без комментариев.
`;

export class NLU {
    constructor({ apiKey }) {
        if (!apiKey) throw new Error('OpenAI API key missing');
        this.client = new OpenAI({ apiKey });
    }

    async classifyIntent(phrase) {
        const res = await this.client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: phrase }
            ],
            temperature: 0
        });
        const text = res.choices?.[0]?.message?.content ?? '{}';
        try {
            return JSON.parse(text);
        } catch {
            return { handlerId: null };
        }
    }
}
