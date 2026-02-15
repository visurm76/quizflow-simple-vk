import { Lesson } from './types';

const STORAGE_KEY = 'eduplatform_lessons';

export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getLessons(): Lesson[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            return JSON.parse(data) as Lesson[];
        } catch (e) {
            console.error('Ошибка парсинга данных', e);
        }
    }
    // Демо-урок
    return [
        {
            id: generateId(),
            title: 'Введение в EduPlatform',
            content: '<p>Добро пожаловать! Это демонстрационный урок.</p><p>Здесь вы можете создавать свои материалы.</p>',
            quiz: {
                title: 'Проверка знаний',
                questions: [
                    {
                        id: generateId(),
                        type: 'single',
                        text: 'Что такое EduPlatform?',
                        options: [
                            { id: generateId(), text: 'Игровая платформа', correct: false },
                            { id: generateId(), text: 'Образовательная платформа', correct: true },
                            { id: generateId(), text: 'Социальная сеть', correct: false }
                        ]
                    }
                ]
            }
        }
    ];
}

export function saveLessons(lessons: Lesson[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
}

export function exportData(): void {
    const data = JSON.stringify(getLessons(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eduplatform_backup.json';
    a.click();
    URL.revokeObjectURL(url);
}

export function importData(file: File, callback: (err: Error | null, lessons?: Lesson[]) => void): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
            const lessons = JSON.parse(e.target?.result as string) as Lesson[];
            saveLessons(lessons);
            callback(null, lessons);
        } catch (err) {
            callback(err as Error);
        }
    };
    reader.readAsText(file);
}