// Заглушка GPT — позже заменим на реальный API
export async function askGPT(prompt) {
    await new Promise(r => setTimeout(r, 300)); // имитация задержки
    return "Привет! Я UniVoice, твой помощник.";
}

