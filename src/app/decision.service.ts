import {Injectable} from '@angular/core';
import {DecisionNode} from "./models/DecisionNode";
import {DECISION_TREE, FAIR_RESOURCES} from "./models/mock-decisions"
import { Observable, of } from 'rxjs';
import {FairResource} from "./models/FairResource";

@Injectable({
  providedIn: 'root'
})
export class DecisionService {

  constructor() {
  }

  getDecisionTree(): Observable<DecisionNode> {
    return of(DECISION_TREE);
  }

  searchResources(): Observable<FairResource[]> {
    return of(FAIR_RESOURCES);
  }
}
