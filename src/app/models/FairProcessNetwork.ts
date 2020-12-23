export interface FairProcessNode {
  id: string;
}

export interface FairProcessEdge extends FairProcessNode {
  source: string;
  target: string;
}
