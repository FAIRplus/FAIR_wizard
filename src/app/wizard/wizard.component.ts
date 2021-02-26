import {Component, OnInit} from '@angular/core';
import {DecisionService} from "../decision.service";
import {DecisionNode, Question} from "../models/DecisionNode";
import {FairResource} from "../models/FairResource";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  decisionTree: Map<string, Question>;
  decisions: DecisionNode[];
  currentNode: Question;
  reachedLeaf: boolean;
  fairResources: FairResource[];

  constructor(private decisionService: DecisionService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.decisionService.getDecisionTree().subscribe(questions => {
      this.decisionTree = new Map();
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
        filters.push(answer.labels);
      }
    }
    this.searchByLabels(filters);
    this.generateSearchUrl();
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
    console.log(params);
    const existingParams = this.route.snapshot.queryParamMap.getAll('answers');
    console.log(existingParams.length);
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
  }
}
