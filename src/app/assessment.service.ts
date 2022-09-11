import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private assessmentUrl = environment.baseUrl + 'assessment';

  constructor(private http: HttpClient) { }

  getIndicatorsForAssessment(): Observable<any> {
    return this.http.get<Object>(this.assessmentUrl);
  }

  submitAssessment(indicators): Observable<any> {
    // return this.http.post<Object>(this.assessmentUrl, {"assessment": indicators});
    return this.http.get<Object>(this.assessmentUrl + 2);
  }

  // getReport(): Observable<any> {
  //   return this.http.get<Object>(this.reportUrl);
  // }
}
