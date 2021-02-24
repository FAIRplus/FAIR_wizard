import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Answer, DecisionNode, Question} from "../models/DecisionNode";

@Component({
  selector: 'app-decision-node',
  templateUrl: './decision-node.component.html',
  styleUrls: ['./decision-node.component.scss']
})
export class DecisionNodeComponent implements OnInit {
  @Input() question: Question;
  @Output() selectAnswerEvent = new EventEmitter<DecisionNode>();
  answers: Answer[];

  constructor() {
  }

  ngOnInit(): void {
    this.answers = [];
  }

  callParent(answer: Answer): void {
    const decision = {
      "question": this.question,
      "answer": answer
    };
    this.selectAnswerEvent.next(decision);
  }

  addAnswer(answer: Answer): void {
    this.answers.push(answer);
  }

  next(): void {
    // const decision = {
    //   "question": this.question,
    //   "answers": this.answers
    // };
    // this.selectAnswerEvent.next(decision);
    const decision = {
      "question": this.question,
      "answer": this.answers.pop()
    };
    this.selectAnswerEvent.next(decision);
  }
}
