export interface MediaItem {
  type: 'image' | 'video' | 'audio';
  url: string;
  caption?: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // HTML-текст
  media: MediaItem[];
}

export interface Answer {
  id: string;
  text: string;
  score: number;
  explanation: string;
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
  level: string;
  color: string;
  interpretation: string;
  recommendations: string[];
}

export interface DiseaseInfo {
  name: string;
  description: string;
  causes: string[];
  symptoms: string[];
  diagnosis: string[];
  treatment: string[];
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

export interface UserAnswer {
  questionId: number;
  selectedAnswerIds: string[];
}

export interface TestResult {
  totalScore: number;
  level: string;
  color: string;
  interpretation: string;
  recommendations: string[];
}