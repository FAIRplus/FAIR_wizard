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

  toggleAnswer(answer: Answer): void {
    const index = this.answers.indexOf(answer);
    if (index !== -1) {
      this.answers.splice(index, 1)
    } else {
      if (!this.question.multipleChoices) {
        this.answers = []
      }
      this.answers.push(answer);
    }
  }

  next(): void {
    const decision = {
      "question": this.question,
      "answers": this.answers
    };
    this.selectAnswerEvent.next(decision);
    this.answers = [];
  }
}
