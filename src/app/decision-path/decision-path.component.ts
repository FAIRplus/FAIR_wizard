import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DecisionNode} from "../models/DecisionNode";

@Component({
  selector: 'app-decision-path',
  templateUrl: './decision-path.component.html',
  styleUrls: ['./decision-path.component.scss']
})
export class DecisionPathComponent implements OnInit {
  @Input() question: string;
  @Input() answer: string;
  @Output() someEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  callParent(answer: string): void {
    this.someEvent.next(answer);
  }

}
