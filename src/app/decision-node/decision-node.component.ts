import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {DecisionNode} from "../models/DecisionNode";

@Component({
  selector: 'app-decision-node',
  templateUrl: './decision-node.component.html',
  styleUrls: ['./decision-node.component.scss']
})
export class DecisionNodeComponent implements OnInit {
  @Input() question: string;
  @Input() answers: DecisionNode[];
  @Output() someEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  callParent(answer: string): void {
    this.someEvent.next(answer);
  }
}
