export interface DecisionNode {
  question: Question;
  answer: Answer;
}

export interface Question {
  id: string;
  question: string;
  answers: Answer[];
}

export interface Answer {
  text: string;
  labels: string[];
  next: string;
}
