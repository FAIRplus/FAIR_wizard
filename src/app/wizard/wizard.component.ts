import {Component, OnInit} from '@angular/core';
import {DecisionService} from "../decision.service";
import {DecisionNode, Question} from "../models/DecisionNode";
import {FairResource} from "../models/FairResource";

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

  constructor(private decisionService: DecisionService) {
  }

  ngOnInit(): void {
    this.decisionService.getDecisionTree().subscribe(questions => {
      this.decisionTree = new Map();
      for (let q of questions) {
        this.decisionTree.set(q.id, q);
      }

      this.currentNode = this.decisionTree.get("1");
    });
    this.decisions = [];
    this.reachedLeaf = false;
    // this.fairResources = [];
  }

  searchResources(): void {
    let filters = [];
    for (let decision of this.decisions) {
      filters.push(decision.answer.labels);
    }
    this.decisionService.searchResources(filters).subscribe(r => this.fairResources = r);
  }

  addDecision(decision: DecisionNode): void {
    this.processDecision(decision);
  }

  processDecision(decision: DecisionNode) {
    this.decisions.push(decision);
    if (decision.answer.next == "0") {
      this.reachedLeaf = true
    } else {
      this.currentNode = this.decisionTree.get(decision.answer.next)
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
