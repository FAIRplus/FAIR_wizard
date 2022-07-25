import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DecisionNode, Question} from "../models/DecisionNode";

@Component({
  selector: 'app-decision-path',
  templateUrl: './decision-path.component.html',
  styleUrls: ['./decision-path.component.scss']
})
export class DecisionPathComponent implements OnInit {
  @Input() decision: DecisionNode;
  @Output() resetNodeEvent = new EventEmitter<Question>();
  fairStep: string;

  constructor() { }

  ngOnInit(): void {
    this.fairStep = "step-" + this.decision.question.category.match(/\d+/)[0];
  }

  callParent(question: Question): void {
    this.resetNodeEvent.next(question);
  }

}
