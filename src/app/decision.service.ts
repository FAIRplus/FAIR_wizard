import {Injectable} from '@angular/core';
import {DecisionNode} from "./models/DecisionNode";
import {DECISION_TREE, FAIR_RESOURCES} from "./models/mock-decisions"
import { Observable, of } from 'rxjs';
import {FairResource} from "./models/FairResource";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DecisionService {
  private searchUrl = 'api/search';
  private wizardUrl = 'api/wizard';

  constructor(private http: HttpClient) {
  }

  getDecisionTree(): Observable<DecisionNode> {
    return this.http.get<DecisionNode>(this.wizardUrl);
    // return of(DECISION_TREE);
  }

  searchResources(): Observable<FairResource[]> {
    return this.http.get<FairResource[]>(this.searchUrl);
    // return of(FAIR_RESOURCES);
  }
}
