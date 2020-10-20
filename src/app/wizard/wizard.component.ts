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
  decisions: string[];
  decisionPath: DecisionNode[];
  currentNode: DecisionNode;
  reachedLeaf: boolean;

  constructor(private decisionService: DecisionService) {
  }

  ngOnInit(): void {
    this.decisionService.getDecisionTree().subscribe(dt => this.decisionTree = dt);
    this.decisions = [];
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

  getNextNode(nodeId: string): DecisionNode {
    let node = this.decisionTree;
    for (let val of this.decisions) {
      console.log("decision: " + val);
      for (let child of node.children) {
        console.log("child id: " + child.id);
        if (child.id == val) {
          node = child;
          console.log("matched: " + child.id + "=" + val);
          break;
        }
      }
      console.log("Error, should not reach here, val = " + val);
    }


    console.log("children size: " + node.children.length);
    for (let child of node.children) {
      if (child.id == nodeId) {
        this.decisions.push(nodeId);
        this.decisionPath.push({
          id: nodeId,
          answer: child.answer,
          question: node.question
        });
        node = child;
        if (node.children == undefined || node.children.length == 0) {
          console.log("reached leaf");
          this.reachedLeaf = true;
        }
        break;
      }
    }

    return node;
  }

}
