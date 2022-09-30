import {DecisionNode} from "./DecisionNode";
import {AssessmentResult, IndicatorGroup} from "./FairAssessment";
import {FairResource} from "./FairResource";

export interface FairSolution {
  id: string;
  link: string;
  createDate: string;
  title: string;
  project: string;
  name: string;
  email: string;
  description: string;
  comments: string;

  decisionTree: DecisionNode[];
  labels: string[]; // this could be interested categories
  indicatorGroups: IndicatorGroup[];
  assessment: AssessmentResult;
  fairResources: FairResource[]; // could be filtered by decision tree results or/and assessment results
}
