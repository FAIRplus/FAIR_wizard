import {Injectable} from '@angular/core';
import {Question} from "./models/DecisionNode";
import {Observable} from 'rxjs';
import {FairResource, FairResourceType} from "./models/FairResource";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DecisionService {
  private searchUrl = environment.baseUrl + 'api/search';
  private wizardUrl = environment.baseUrl + 'api/wizard';
  private processNetworkUrl = environment.baseUrl + 'api/processes';
  private assessmentUrl = environment.baseUrl + 'api/assessment';
  private permalinkUrl = environment.baseUrl + 'api/permalink';
  private reportUrl = environment.baseUrl + 'api/report';

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

  getAssessments(): Observable<any> {
    return this.http.get<Object>(this.assessmentUrl);
  }

  submitAssessment(assessment): Observable<any> {
    return this.http.post<Object>(this.assessmentUrl, {"assessment": assessment});
  }

  saveSearch(resourceUrl: string): Observable<Object> {
    return this.http.post<Object>(environment.baseUrl + 'api/permalink', {"resourceLink": resourceUrl});
  }

  getReport(): Observable<any> {
    return this.http.get<Object>(this.assessmentUrl);
  }


}
