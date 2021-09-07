export interface FairResource {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  resourceType: FairResourceType;
  labels: string[];
}

export enum FairResourceType {
  process,
  recipe,
  indicator,
  tool,
  requirement
}
