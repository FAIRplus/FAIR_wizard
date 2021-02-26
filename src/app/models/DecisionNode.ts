export interface DecisionNode {
  question: Question;
  answers: Answer[];
}

export interface Question {
  id: string;
  question: string;
  answers: Answer[];
  multipleChoices: boolean;
}

export interface Answer {
  text: string;
  labels: string[];
  next: string;
}
