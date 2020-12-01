import {Injectable} from '@angular/core';
import {DecisionNode} from "./models/DecisionNode";
import {Observable} from 'rxjs';
import {FairResource, FairResourceType} from "./models/FairResource";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";

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

  searchResources(filters: string[]): Observable<FairResource[]> {
    let params = new HttpParams();
    for (let filter of filters) {
      params = params.set("filters", filter);
    }

    console.log(filters);
    console.log(params);
    return this.http.get<FairResource[]>(this.searchUrl, {params: params})
      .pipe(map(resources => {
        let fairResources: FairResource[] = [];
        resources.forEach(r => r.resourceType = FairResourceType[r.resourceType.toString() as keyof typeof FairResourceType]);
        return resources;
      }));
    // return of(FAIR_RESOURCES);
  }
}
