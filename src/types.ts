// Типы для конфига приложения
export interface DiseaseInfo {
  name: string;
  description: string;
  causes: string[];
  symptoms: string[];
  diagnosis: string[];
  treatment: string[];
}

export interface Answer {
  id: string;
  text: string;
  score: number;        // баллы за этот ответ
  explanation: string;   // объяснение после ответа
}

export interface Question {
  id: number;
  text: string;
  type: 'single' | 'multiple';
  answers: Answer[];
}

export interface ScoreRange {
  min: number;
  max: number;
  level: string;            // например "Низкий", "Средний", "Высокий"
  color: string;            // цвет для отображения
  interpretation: string;   // краткая интерпретация
  recommendations: string[]; // список рекомендаций
}

export interface AppConfig {
  disease: DiseaseInfo;
  quiz: {
    title: string;
    questions: Question[];
    scoring: {
      ranges: ScoreRange[];
    };
  };
}

// Типы для состояния пользователя
export interface UserAnswer {
  questionId: number;
  selectedAnswerIds: string[]; // массив id выбранных ответов
}

export interface TestResult {
  totalScore: number;
  level: string;
  color: string;
  interpretation: string;
  recommendations: string[];
}