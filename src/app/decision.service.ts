import {Injectable} from '@angular/core';
import {DecisionNode, Question} from "./models/DecisionNode";
import {Observable} from 'rxjs';
import {FairResource} from "./models/FairResource";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {environment} from "../environments/environment";
import {SavedSearch} from "./models/SavedSearch";
import {FairSolution} from "./models/FairSolution";

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

  private saveSolutionUrl = environment.baseUrl + 'api/solution';

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
    return this.http.get<FairResource>(this.resourceUrl, {params: params});
  }

  searchResources(filters: string[]): Observable<FairResource[]> {
    let params = new HttpParams();
    for (let filter of filters) {
      if (filter) {
        params = params.append("filters", filter);
      }
    }

    return this.http.get<FairResource[]>(this.searchUrl, {params: params});

    // return this.http.get<FairResource[]>(this.searchUrl, {params: params})
    //   .pipe(map(resources => {
    //     resources.forEach(r => {
    //       if (r.resourceType !== undefined) {
    //         r.resourceType = FairResourceType[r.resourceType.toString() as keyof typeof FairResourceType]
    //       } else {
    //         console.log("Error in data: resourceType is undefined for " + r);
    //       }
    //     });
    //     return resources;
    //   }));
  }

  initFairSolutionFromDecisionTree(decisonTree: DecisionNode[]): Observable<FairSolution> {
    let questions = [];
    for (let decision of decisonTree) {
      let q = decision.question;
      let questionClone : Question = {
        id: q.id,
        question: q.question,
        answers: decision.answers,
        multipleChoices: q.multipleChoices,
        category: q.category,
        description: q.description
      };
      questions.push(questionClone);
    }
    console.log(questions);
    return this.http.post<FairSolution>(this.searchUrl, questions);
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

  saveFairSolution(fairSolution: FairSolution): Observable<FairSolution> {
    return this.http.post<FairSolution>(this.saveSolutionUrl, fairSolution);
  }

  getSavedSolution(solutionId: string): Observable<FairSolution> {
    return this.http.get<FairSolution>(this.saveSolutionUrl + "/" + solutionId);
  }

  getReport(): Observable<any> {
    return this.http.get<Object>(this.reportUrl);
  }


}
