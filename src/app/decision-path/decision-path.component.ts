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
  @Input() pathIndex: number;
  @Output() someEvent = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  callParent(index: number): void {
    this.someEvent.next(index);
  }

}
