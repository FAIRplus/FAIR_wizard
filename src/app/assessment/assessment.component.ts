import { Component, OnInit } from '@angular/core';
import {DecisionService} from "../decision.service";
import {FairResource} from "../models/FairResource";

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {

  public selectedLevels = "Level-0";
  fairResources: FairResource[];
  assessmentFields;
  displayedFields;

  constructor(public decisionService: DecisionService) { }

  ngOnInit(): void {
    this.decisionService.getAssessments()
      .subscribe(p => {
        this.assessmentFields = p;
        this.filterResults("Level-0");
      });
  }

  filterResults(levels) {
    this.selectedLevels = levels;
    this.displayedFields = this.assessmentFields.filter(a => a.levels === levels);
  }

  submitAssessment() {
    this.decisionService.searchResources(Array.from(this.filters.values())).subscribe(r => this.fairResources = r);
  }

  get filters() : Set<string> {
    let filters = new Set<string>();
    for (let field of this.assessmentFields) {
      if (!field.score_overall) {
        for(let l of field.labels)
          filters.add(l);
      }
    }
    return filters;
  }

}
