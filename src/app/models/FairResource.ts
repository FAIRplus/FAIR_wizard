export interface FairResource {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  resourceType: FairResourceType;
}

export enum FairResourceType {
  Process,
  Recipe,
  Indicator,
  Tool,
  Requirement
}
