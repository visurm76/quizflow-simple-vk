// src/data/testQuestions.ts
export interface Answer {
  text: string;
  nextUrl: string; // может быть внутренним маршрутом или внешней ссылкой
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

export const testQuestions: Question[] = [
  {
    id: 1,
    text: 'Какие симптомы вас беспокоят?',
    answers: [
      { text: 'Головная боль', nextUrl: '/info#headache' },
      { text: 'Температура', nextUrl: 'https://example.com/fever' },
      { text: 'Кашель', nextUrl: '/test/2' },
    ],
  },
  {
    id: 2,
    text: 'Как давно вы кашляете?',
    answers: [
      { text: 'Менее недели', nextUrl: '/info#cough-short' },
      { text: 'Более недели', nextUrl: 'https://example.com/cough-long' },
    ],
  },
];