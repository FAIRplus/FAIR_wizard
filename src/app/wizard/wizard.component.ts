import {Component, OnInit} from '@angular/core';
import {DecisionService} from "../decision.service";
import {DecisionNode} from "../models/DecisionNode";

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  decisionTree: DecisionNode;
  decisionPath: DecisionNode[];
  currentNode: DecisionNode;
  reachedLeaf: boolean;

  constructor(private decisionService: DecisionService) {
  }

  ngOnInit(): void {
    this.decisionService.getDecisionTree().subscribe(dt => this.decisionTree = dt);
    this.decisionPath = [];
    this.currentNode = this.decisionTree;
    this.reachedLeaf = false;
  }

  addDecision(nodeId: string): void {
    console.log("parent: " + nodeId);
    let node = this.getNextNode(nodeId);
    this.currentNode = node;
    console.log(node);
  }

  resetDecision(pathIndex: number): void {
    console.log("Path index:" + pathIndex);
    if (pathIndex == 0) {
      this.decisionPath = [];
      this.currentNode = this.decisionTree;
      this.reachedLeaf = false;
    } else {
      let pathId = this.decisionPath[pathIndex - 1].id;
      this.decisionPath = this.decisionPath.slice(0, pathIndex - 1);
      this.currentNode = this.getNextNode(pathId);
      this.reachedLeaf = false;
    }
  }

  getNextNode(nodeId: string): DecisionNode {
    let node = this.decisionTree;
    for (let decision of this.decisionPath) {
      for (let child of node.children) {
        console.log("child id: " + child.id);
        if (child.id == decision.id) {
          node = child;
          break;
        }
      }
      console.log("Error, should not reach here, val = " + decision.id);
    }

    for (let child of node.children) {
      if (child.id == nodeId) {
        this.decisionPath.push({
          id: nodeId,
          answer: child.answer,
          question: node.question
        });
        node = child;
        if (node.children == undefined || node.children.length == 0) {
          this.reachedLeaf = true;
        }
        break;
      }
    }

    return node;
  }

}
