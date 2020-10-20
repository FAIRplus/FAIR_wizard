import {Injectable} from '@angular/core';
import {DecisionNode} from "./models/DecisionNode";
import {DECISION_TREE} from "./models/mock-decisions"
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DecisionService {

  constructor() {
  }

  getDecisionTree(): Observable<DecisionNode> {
    return of(DECISION_TREE);
  }
}
