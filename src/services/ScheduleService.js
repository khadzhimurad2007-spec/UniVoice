// src/services/ScheduleService.js

export function addScheduleItem({ subject, day, startTime, endTime, room = '', teacher = '' }) {
    try {
        // Получаем текущее расписание
        const schedule = JSON.parse(localStorage.getItem('univoice_schedule') || '[]');

        // Создаем новое занятие
        const newItem = {
            id: Date.now(),
            subject: subject,
            day: day.charAt(0).toUpperCase() + day.slice(1), // Первая буква заглавная
            startTime: startTime,
            endTime: endTime,
            room: room,
            teacher: teacher
        };

        console.log('Adding schedule item:', newItem);

        // Добавляем и сохраняем
        schedule.push(newItem);
        localStorage.setItem('univoice_schedule', JSON.stringify(schedule));

        return newItem;
    } catch (error) {
        console.error('Error adding schedule item:', error);
        throw error;
    }
}

export function getSchedule() {
    try {
        return JSON.parse(localStorage.getItem('univoice_schedule') || '[]');
    } catch (error) {
        console.error('Error getting schedule:', error);
        return [];
    }
}

export function deleteScheduleItem(id) {
    try {
        const schedule = JSON.parse(localStorage.getItem('univoice_schedule') || '[]');
        const updatedSchedule = schedule.filter(item => item.id !== id);
        localStorage.setItem('univoice_schedule', JSON.stringify(updatedSchedule));
        return updatedSchedule;
    } catch (error) {
        console.error('Error deleting schedule item:', error);
        throw error;
    }
}

export function clearSchedule() {
    try {
        localStorage.setItem('univoice_schedule', JSON.stringify([]));
        return [];
    } catch (error) {
        console.error('Error clearing schedule:', error);
        throw error;
    }
}