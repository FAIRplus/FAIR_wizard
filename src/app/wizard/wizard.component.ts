import {Component, OnInit} from '@angular/core';
import {DecisionService} from "../decision.service";
import {Answer, DecisionNode, Question} from "../models/DecisionNode";
import {FairResource} from "../models/FairResource";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {FairResourceComponent} from "../common/fair-resource/fair-resource.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SaveDialogComponent} from "../common/save-dialog/save-dialog.component";
import {wizardMetadata} from "../models/SavedSearch";
import {FairSolution} from "../models/FairSolution";

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  MAX_DECISION_DEPTH = 15;
  decisionTree: Map<string, Question>;
  decisions: DecisionNode[];
  currentNode: Question;
  reachedLeaf: boolean;
  fairResources: FairResource[];
  permaLink: string;
  progress: number;
  progressText: string;
  fairStep: string;

  fairSolution: FairSolution;

  constructor(private decisionService: DecisionService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal) {
    this.currentNode = { // empty assignment to fix browser error
      id: '0',
      category: 'Undefined',
      question: 'string',
      answers: [],
      multipleChoices: false,
      description: 'string',
    }
  }

  ngOnInit(): void {
    this.progressText = "0%";
    this.decisionService.getDecisionTree().subscribe(questions => {
      this.decisionTree = new Map();
      this.progress = 0;
      for (let q of questions) {
        this.decisionTree.set(q.id, q);
      }

      this.currentNode = this.decisionTree.get("1");
      this.fairStep = "step-" + this.currentNode.category.match(/\d+/)[0];
      this.processQueryParams();
    });
    this.decisions = [];
    this.reachedLeaf = false;
    // this.fairResources = [];

    this.getSavedSolution();
  }

  getFairSolution(): void {
    this.decisionService.initFairSolutionFromDecisionTree(this.decisions).
    subscribe(s => {
      this.fairSolution = s;
      this.fairResources = this.fairSolution.fairResources;
      console.log(this.fairSolution);
    });

    // this.generateSearchUrl();
    this.progress = 100;
  }

  getSavedSolution() {
    const solutionId = this.router.url.split("=")[1];
    console.log(solutionId);
    if (solutionId) {
      this.decisionService.getSavedSolution(solutionId).subscribe(s => {
        console.log(s);
        this.fairSolution = s;
        this.fairResources = this.fairSolution.fairResources;
        this.initDecisionTree();
        this.progress = 100;
      });
      console.log(this.fairSolution);
    }
  }

  processQueryParams() {
    const params = this.route.snapshot.queryParamMap.getAll('answers');
    if (params.length > 0) {
      this.processQueryParamsAnswers(params);
    }
  }

  processQueryParamsAnswers(params: string[]) {
    for (let p of params) {
      let answers = [];
      let answersText: string[] = p.split(":");
      for (let answerText of answersText) {
        for (let answer of this.currentNode.answers) {
          if (answer.text === answerText) {
            answers.push(answer);
          }
        }
      }

      const decision = {
        "question": this.currentNode,
        "answers": answers
      };
      this.processDecision(decision);
    }

    if (this.reachedLeaf) {
      this.searchResources();
    }
  }

  initDecisionTree() {
    for (let node of this.fairSolution.decisionTree) {
      let answers = [];

      // need to map to object of this.decisionTree instead todo change Answer equals logic
      for (let nodeAnswer of node.answers) {
        for (let answer of this.currentNode.answers) {
          if (answer.text === nodeAnswer.text) {
            answers.push(answer);
          }
        }
      }

      const decision = {
        "question": this.currentNode,
        "answers": answers
      };
      this.processDecision(decision);
    }
  }

  searchResources(): void {
    let filters = [];
    for (let decision of this.decisions) {
      for (let answer of decision.answers) {
        filters.push(...answer.labels);
      }
    }
    this.searchByLabels(filters);
    this.generateSearchUrl();
    this.progress = 100;
  }

  get filters(): string[] {
    let filters = [];
    for (let decision of this.decisions) {
      for (let answer of decision.answers) {
        filters.push(...answer.labels);
      }
    }
    return filters;
  }

  generateQueryParams() {
    let params = [];
    for (let decision of this.decisions) {
      let param = '';
      for (let answer of decision.answers) {
        param = param === '' ? answer.text : param + ":" + answer.text;
      }
      params.push(param)
    }

    return {answers: params}
  }

  generateSearchUrl() {
    const params = this.generateQueryParams();
    const existingParams = this.route.snapshot.queryParamMap.getAll('answers');
    if (existingParams.length <= 0) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: params,
        queryParamsHandling: 'merge',
        skipLocationChange: false
      })
    }
  }

  searchByLabels(filters: string[]) {
    this.decisionService.searchResources(filters).subscribe(r => this.fairResources = r);
  }

  addDecision(decision: DecisionNode): void {
    this.processDecision(decision);
    this.calculateProgress();
  }

  processDecision(decision: DecisionNode) {
    console.log(decision);
    this.decisions.push(decision);
    console.log(this.decisions);
    if (decision.answers[0].next == "0") {//todo
      this.reachedLeaf = true
    } else {
      this.currentNode = this.decisionTree.get(decision.answers[0].next)//todo
    }
    this.fairStep = "step-" + this.currentNode.category.match(/\d+/)[0];
  }

  resetDecision(question: Question): void {
    let newDecisions = [];
    for (let decision of this.decisions) {
      if (decision.question.id === question.id) {
        this.currentNode = question;
        break;
      }
      newDecisions.push(decision);
    }

    this.decisions = newDecisions;
    this.fairResources = [];
    this.reachedLeaf = false;
    this.calculateProgress();
  }

  saveSearch() {
    this.decisionService.saveSearch(this.router.url).subscribe(p => {
      // this.permaLink = environment.baseUrl + "api/permalink/" + p.id;
      // this.permaLink = window.location.origin + "/api/permalink/" + p.id;
      this.permaLink = window.location.origin + environment.baseUrl + "api/permalink/" + p.id;
    });
  }

  downloadReport() {
    let reportLink = environment.baseUrl + "api/report?" + this.router.url.split("?")[1]
    console.log(reportLink);
    window.open(reportLink, "_blank");
  }

  calculateProgress() {
    let currentProgress = this.decisions.length;
    this.progress = currentProgress * 100 / this.MAX_DECISION_DEPTH;
  }

  gotoAssessment() {
    alert("Not implemented yet!")
  }

  openSaveDialog() {
    const modalRef = this.modalService.open(SaveDialogComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.fairSolution = this.fairSolution;
    modalRef.componentInstance.modalRef = modalRef;
  }
}
