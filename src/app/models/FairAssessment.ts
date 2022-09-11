export interface Indicator {
  id: string;
  name: string;
  description: string;
  order: number;
  level: number;
  evaluation: boolean;
  links: string[];
}

export interface IndicatorGroup {
  category: string;
  description: string;
  order: string;
  indicators: Indicator[];
}

export interface AssessmentResult {
  fairLevel: number;
  fairPercentage: number;
  categoryLevel: Map<String, number>;
  levels: AssessmentLevel[];
}

export interface AssessmentLevel {
  level: number;
  percentage: number;
  categoryPercentage: Map<String, number>;
  indicators: Indicator[];
}


