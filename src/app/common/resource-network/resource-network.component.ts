import {Component, Input, OnInit} from '@angular/core';
import * as cytoscape from "cytoscape";
import {DecisionService} from "../../decision.service";

@Component({
  selector: 'app-resource-network',
  templateUrl: './resource-network.component.html',
  styleUrls: ['./resource-network.component.scss']
})
export class ResourceNetworkComponent implements OnInit {
  @Input() filters: string[];
  processes: Object;

  constructor(public decisionService: DecisionService) {

  }

  ngOnInit(): void {
    if (this.filters == null) {
      this.filters = [];
    }
    this.getNetwork();
  }

  getNetwork(): void {
    this.decisionService.getProcessNetwork(this.filters, '')
      .subscribe(p => {
        this.processes = p;
        this.draw();
      });
  }

  getProcessNetwork(id) {
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
            'width': 100,
            'height': 100,
            'background-color': '#f0f0f0',
            'border-width': 3,
            'border-color': '#929292',
            'label': 'data(label)',
            'color': '#4b4b4b',
            'font-size': 30
          }
        },
        {
          selector: 'node[type="Process"]',
          style: {
            'shape': 'rectangle',
            'background-color': '#cde1f0'
          }
        },
        {
          selector: 'node[type="Tool"]',
          style: {
            'background-color': '#b1f0cb'
          }
        },
        {
          selector: 'node[type="Indicator"]',
          style: {
            'background-color': '#f0efcb'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#d4d4d4',
            'target-arrow-color': '#D4D4D4',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'color': '#848484',
            'font-size': 25
          }
        }
      ],

      layout: {
        name: 'concentric',
        // name: 'grid',
        // rows: 10,
        // cols: 20
      }

    });
  }

}
