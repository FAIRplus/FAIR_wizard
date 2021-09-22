import { Component, OnInit } from '@angular/core';
import {DecisionService} from "../decision.service";
import {FairResource} from "../models/FairResource";

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {

  public selectedPrinciple = "Findable";
  fairResources: FairResource[];

  assessmentFields = [
    {
      "id": "RDA-F1-01M",
      "principle": "Findable",
      "sub_principle": "F1",
      "name": "Metadata is identified by a persistent identifier",
      "description": "This indicator evaluates whether or not the metadata is identified by a persistent identifier. A persistent identifier ensures that the metadata will remain findable over time and reduces the risk of broken links.",
      "priority": "Essential",
      "score_overall": true,
      "score_essential": false,
      "score_non_essential": true,
      "assessment_details": "",
      "labels": ["", ""]
    }
  ];

  displayedFields;

  constructor(public decisionService: DecisionService) { }

  ngOnInit(): void {
    this.decisionService.getAssessments()
      .subscribe(p => {
        this.assessmentFields = p;
        this.filterResults("Findable");
      });
  }

  filterResults(principle) {
    this.selectedPrinciple = principle;
    this.displayedFields = this.assessmentFields.filter(a => a.principle === principle);
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
