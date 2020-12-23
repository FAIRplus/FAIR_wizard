import {Injectable} from '@angular/core';
import {Question} from "./models/DecisionNode";
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
  private processNetworkUrl = 'api/processes';

  constructor(private http: HttpClient) {
  }

  getDecisionTree(): Observable<Question[]> {
    return this.http.get<Question[]>(this.wizardUrl);
    // return of(DECISION_TREE);
  }

  searchResources(filters: string[]): Observable<FairResource[]> {
    let params = new HttpParams();
    for (let filter of filters) {
      if (filter) {
        params = params.append("filters", filter);
      }
    }

    return this.http.get<FairResource[]>(this.searchUrl, {params: params})
      .pipe(map(resources => {
        let fairResources: FairResource[] = [];
        resources.forEach(r => r.resourceType = FairResourceType[r.resourceType.toString() as keyof typeof FairResourceType]);
        return resources;
      }));
    // return of(FAIR_RESOURCES);
  }

  getProcessNetwork(filters: string[], process: string): Observable<Object> {
    let params = new HttpParams();
    for (let filter of filters) {
      if (filter) {
        params = params.append("filters", filter);
      }
    }
    params = params.append("process", process);

    return this.http.get<Object>(this.processNetworkUrl, {params: params});
  }
}
