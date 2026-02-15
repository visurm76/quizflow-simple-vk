export interface Option {
    id: string;
    text: string;
    correct: boolean;
}

export type QuestionType = 'single' | 'multiple';

export interface Question {
    id: string;
    type: QuestionType;
    text: string;
    options: Option[];
}

export interface Quiz {
    title: string;
    questions: Question[];
}

export interface Lesson {
    id: string;
    title: string;
    content: string;
    quiz: Quiz | null;
}