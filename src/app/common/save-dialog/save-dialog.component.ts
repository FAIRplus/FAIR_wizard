import {Component, Input, OnInit} from '@angular/core';
import {FairSolution} from "../../models/FairSolution";
import {DecisionService} from "../../decision.service";
import {environment} from "../../../environments/environment";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss']
})
export class SaveDialogComponent implements OnInit {
  @Input() fairSolution: FairSolution;
  @Input() modalRef: NgbModalRef;
  validationErrorMessage: string;
  // saved: boolean;

  constructor(private decisionService: DecisionService) {
  }

  ngOnInit(): void {
    // this.saved = !!this.fairSolution.title;
  }

  saveFairSolution(): void {
    if (this.fairSolution.title) {
      this.fairSolution.link = this.generateSolutionUrl()
      this.decisionService.saveFairSolution(this.fairSolution).subscribe(solution => this.fairSolution = solution);
      this.modalRef.close();
    } else {
      this.validationErrorMessage = "Please fill in the title before saving";
    }
  }

  saveSolutionAndGenerateReport(): void {
    if (this.fairSolution.title) {
      this.fairSolution.link = this.generateSolutionUrl()
      this.decisionService.saveFairSolution(this.fairSolution).subscribe(solution => {
        this.fairSolution = solution;
        let reportLink = environment.baseUrl + "api/report/" + this.fairSolution.id;
        window.open(reportLink, "_blank");
        this.modalRef.close();
      });
    } else {
      this.validationErrorMessage = "Please fill in the title before saving";
    }
  }

  generateSolutionUrl() {
    return this.generateLocationUrl() + "wizard?id=" + this.fairSolution.id;
  }

  generateLocationUrl() {
    if (environment.baseUrl === "/") {
      return window.location.origin + "/";
    } else {
      return environment.baseUrl;
    }
  }

}
