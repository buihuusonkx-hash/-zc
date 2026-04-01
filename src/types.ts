export enum CognitiveLevel {
  RECOGNITION = "Nhận biết",
  UNDERSTANDING = "Thông hiểu",
  APPLICATION = "Vận dụng",
  HIGH_APPLICATION = "Vận dụng cao"
}

export enum QuestionType {
  MULTIPLE_CHOICE = "Trắc nghiệm",
  ESSAY = "Tự luận"
}

export interface LearningOutcome {
  id: string;
  code: string;
  content: string;
}

export interface Topic {
  id: string;
  name: string;
  outcomes: LearningOutcome[];
}

export interface Question {
  id: string;
  topicId: string;
  outcomeId: string;
  content: string;
  type: QuestionType;
  level: CognitiveLevel;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  points: number;
}

export interface MatrixCell {
  topicId: string;
  level: CognitiveLevel;
  type: QuestionType;
  count: number;
}

export interface ExamConfig {
  id: string;
  title: string;
  grade: string;
  subject: string;
  timeLimit: number; // minutes
  totalPoints: number;
  matrix: MatrixCell[];
  topics: string[]; // IDs
}

export interface Exam {
  id: string;
  config: ExamConfig;
  questions: Question[];
  createdAt: string;
}

export interface AppState {
  topics: Topic[];
  questions: Question[];
  exams: Exam[];
  settings: {
    geminiApiKey: string;
    model: string;
  };
}
