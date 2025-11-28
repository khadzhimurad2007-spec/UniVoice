// src/api/gpt.js
function sanitizeApiKey(raw) {
    if (typeof raw !== "string") return "";
    // Удаляем невидимые и пробельные символы по краям
    let key = raw.trim();

    // Заменяем типичные невидимые юникод-символы
    // (Zero-Width Space, Non-breaking space и т.п.)
    key = key.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "");

    // Проверяем, что это ASCII и начинается с sk-
    const isAscii = /^[\x00-\x7F]+$/.test(key);
    const looksLikeOpenAI = /^sk-[A-Za-z0-9]/.test(key);
    if (!isAscii || !looksLikeOpenAI) return "";

    return key;
}

export async function askGPT(prompt) {
    const rawKey = import.meta.env.VITE_OPENAI_KEY;
    const apiKey = sanitizeApiKey(rawKey);

    if (!apiKey) {
        throw new Error(
            "API ключ OpenAI не найден или содержит недопустимые символы. Вставьте реальный ключ без кавычек и пробелов."
        );
    }

    try {
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // В заголовок попадает только проверенный ASCII-ключ
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "Ты полезный AI помощник для приложения UniVoice МАДИ. Отвечай подробно и помогай пользователям с вопросами о приложении и учебе. Отвечай только на русском языке."
                    },
                    { role: "user", content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!resp.ok) {
            const errData = await safeJson(resp);
            const msg =
                errData?.error?.message ||
                `Ошибка OpenAI: ${resp.status} ${resp.statusText}`;
            throw new Error(msg);
        }

        const data = await resp.json();
        const content = data?.choices?.[0]?.message?.content;

        // Проверяем и исправляем кодировку ответа
        if (content) {
            return fixEncoding(content);
        }

        return "Нет текста в ответе модели.";
    } catch (err) {
        const m = err?.message || "Ошибка запроса к GPT.";
        // Нормализуем самые частые случаи
        if (m.includes("Incorrect API key")) {
            throw new Error("Неверный API‑ключ OpenAI. Проверь значение в .env (без кавычек и лишних символов).");
        }
        if (m.includes("ISO-8859-1")) {
            throw new Error("В заголовке есть недопустимые символы. Вставь ключ заново, убери кавычки/пробелы/кириллицу.");
        }
        throw new Error(m);
    }
}

// Функция для исправления проблем с кодировкой
function fixEncoding(text) {
    if (!text) return text;

    // Если текст содержит кракозябры, пробуем исправить
    if (/[�]/.test(text) || /[А-Яа-я]/.test(text) === false) {
        try {
            // Пробуем разные кодировки
            const decoders = [
                (str) => str, // оригинал
                (str) => decodeURIComponent(escape(str)), // latin1 to utf8
                (str) => {
                    try {
                        return new TextDecoder('windows-1251').decode(new TextEncoder().encode(str));
                    } catch {
                        return str;
                    }
                },
                (str) => {
                    try {
                        return new TextDecoder('iso-8859-1').decode(new TextEncoder().encode(str));
                    } catch {
                        return str;
                    }
                }
            ];

            for (const decoder of decoders) {
                const decoded = decoder(text);
                if (/[А-Яа-я]/.test(decoded)) {
                    return decoded;
                }
            }
        } catch (error) {
            console.warn('Encoding fix failed:', error);
        }
    }

    return text;
}

async function safeJson(resp) {
    try {
        const text = await resp.text();
        return JSON.parse(text);
    } catch {
        return null;
    }
}