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

export async function askGPT(question) {
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
                    { role: "system", content: "Ты помощник для студента. Отвечай кратко и по делу." },
                    { role: "user", content: question },
                ],
                temperature: 0.7,
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

        return content || "Нет текста в ответе модели.";
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

async function safeJson(resp) {
    try {
        return await resp.json();
    } catch {
        return null;
    }
}
