export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface Option {
  key: OptionKey;
  text: string;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
  correctAnswer: OptionKey;
  correctAnswerText: string;
  rationale: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: OptionKey;
  isCorrect: boolean;
}
