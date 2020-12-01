import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DecisionNode, Question} from "../models/DecisionNode";

@Component({
  selector: 'app-decision-path',
  templateUrl: './decision-path.component.html',
  styleUrls: ['./decision-path.component.scss']
})
export class DecisionPathComponent implements OnInit {
  @Input() decision: DecisionNode;
  @Output() someEvent = new EventEmitter<Question>();

  constructor() { }

  ngOnInit(): void {
  }

  callParent(question: Question): void {
    this.someEvent.next(question);
  }

}
