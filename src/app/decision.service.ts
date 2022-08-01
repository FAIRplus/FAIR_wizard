import {Injectable} from '@angular/core';
import {Question} from "./models/DecisionNode";
import {Observable} from 'rxjs';
import {FairResource, FairResourceType} from "./models/FairResource";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {environment} from "../environments/environment";
import {SavedSearch} from "./models/SavedSearch";

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
  private resourceUrl = environment.baseUrl + 'api/resource';
  private processDiagramUrl = environment.baseUrl + 'api/processDiagram';

  constructor(private http: HttpClient) {
  }

  getDecisionTree(): Observable<Question[]> {
    return this.http.get<Question[]>(this.wizardUrl);
    // return of(DECISION_TREE);
  }

  getResource(resourceId: string): Observable<FairResource> {
    // let params = encodeURIComponent("?resourceId=" + resourceId);
    let params = new HttpParams();
    params = params.append("resourceId", encodeURIComponent(resourceId));
    return this.http.get<FairResource>(this.resourceUrl, {params: params})
      .pipe(map(r => {
        if (r.resourceType !== undefined) {
          r.resourceType = FairResourceType[r.resourceType.toString() as keyof typeof FairResourceType]
        } else {
          console.log("Error in data: resourceType is undefined for " + r);
        }
        return r;
      }));
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
        resources.forEach(r => {
          if (r.resourceType !== undefined) {
            r.resourceType = FairResourceType[r.resourceType.toString() as keyof typeof FairResourceType]
          } else {
            console.log("Error in data: resourceType is undefined for " + r);
          }
        });
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

  getParentProcesses() {
    return this.http.get<[]>(this.processDiagramUrl);
  }

  getAssessments(): Observable<any> {
    return this.http.get<Object>(this.assessmentUrl);
  }

  submitAssessment(assessment): Observable<any> {
    return this.http.post<Object>(this.assessmentUrl, {"assessment": assessment});
  }

  saveSearch(resourceUrl: string): Observable<SavedSearch> {
    return this.http.post<SavedSearch>(this.permalinkUrl, {"resourceLink": resourceUrl});
  }

  getReport(): Observable<any> {
    return this.http.get<Object>(this.reportUrl);
  }


}
