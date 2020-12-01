import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Answer, DecisionNode, Question} from "../models/DecisionNode";

@Component({
  selector: 'app-decision-node',
  templateUrl: './decision-node.component.html',
  styleUrls: ['./decision-node.component.scss']
})
export class DecisionNodeComponent implements OnInit {
  @Input() question: Question;
  @Output() someEvent = new EventEmitter<DecisionNode>();

  constructor() {
  }

  ngOnInit(): void {
  }

  callParent(answer: Answer): void {
    const decision = {
      "question": this.question,
      "answer": answer
    };
    this.someEvent.next(decision);
  }
}
