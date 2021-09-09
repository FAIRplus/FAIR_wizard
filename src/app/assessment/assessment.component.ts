import { Component, OnInit } from '@angular/core';
import {DecisionService} from "../decision.service";

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {

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
      "assessment_details": ""
    },
    {
      "id": "RDA-A1.1-01D",
      "principle": "Accessible",
      "sub_principle": "A1.1",
      "name": "Data is accessible through a free access protocol",
      "description": "short decscription",
      "priority": "Important",
      "score_overall": false,
      "score_essential": false,
      "score_non_essential": true,
      "assessment_details": ""
    },
    {
      "id": "RDA-R1.1-01M",
      "principle": "Reusable",
      "sub_principle": "R1.1",
      "name": "Metadata includes information about the licence under which the data can be reused",
      "description": "short decscription",
      "priority": "Essential",
      "score_overall": false,
      "score_essential": true,
      "score_non_essential": true,
      "assessment_details": ""
    },
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
    this.displayedFields = this.assessmentFields.filter(a => a.principle === principle);
  }

}
