import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import * as cytoscape from 'cytoscape';
import {DecisionService} from "../../decision.service";

@Component({
  selector: 'app-process-dialog',
  templateUrl: './process-dialog.component.html',
  styleUrls: ['./process-dialog.component.scss']
})
export class ProcessDialogComponent implements OnInit {
  @Input() name;
  processes: Object;

  constructor(public activeModal: NgbActiveModal, public decisionService: DecisionService) {
  }

  ngOnInit(): void {
    this.getNetwork();
  }

  getNetwork(): void {
    this.decisionService.getProcessNetwork([], '')
      .subscribe(p => {
        this.processes = p;
        this.draw();
      });
  }

  draw(): void {
    let cytoscapeElements = JSON.parse(JSON.stringify(this.processes));

    var cy = cytoscape({
      container: document.getElementById('cy'), // container to render in
      elements: cytoscapeElements,
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'
          }
        },

        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],

      layout: {
        name: 'breadthfirst',
        rows: 4,
        cols: 3
      }

    });
  }

}
