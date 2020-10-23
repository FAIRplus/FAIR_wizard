export interface DecisionNode {
  id: string;
  question: string;
  answer: string;
  children?: DecisionNode[];
  labels?: string[];
  displayAnswer?: string;
}
