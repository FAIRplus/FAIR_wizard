import {Component, OnInit} from '@angular/core';
import {DecisionService} from "../decision.service";
import {DecisionNode, Question} from "../models/DecisionNode";
import {FairResource} from "../models/FairResource";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  MAX_DECISION_DEPTH = 5;
  decisionTree: Map<string, Question>;
  decisions: DecisionNode[];
  currentNode: Question;
  reachedLeaf: boolean;
  fairResources: FairResource[];
  permaLink: string;
  progress: number;
  progressText: string;

  constructor(private decisionService: DecisionService, private route: ActivatedRoute, private router: Router) {
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
      this.processQueryParams();
    });
    this.decisions = [];
    this.reachedLeaf = false;
    // this.fairResources = [];

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

    if(this.reachedLeaf) {
      this.searchResources();
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

  get filters() : string[] {
    let filters = [];
    for (let decision of this.decisions) {
      for (let answer of decision.answers) {
        filters.push(answer.labels);
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
    this.decisions.push(decision);
    if (decision.answers[0].next == "0") {//todo
      this.reachedLeaf = true
    } else {
      this.currentNode = this.decisionTree.get(decision.answers[0].next)//todo
    }
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
    window.open(reportLink, "_blank");
  }

  calculateProgress() {
    let currentProgress = this.decisions.length;
    this.progress = currentProgress * 100 / this.MAX_DECISION_DEPTH;
  }
}
