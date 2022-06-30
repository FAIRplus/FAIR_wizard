import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProcessDialogComponent} from "../process-dialog/process-dialog.component";

@Component({
  selector: 'app-process-diagram',
  templateUrl: './process-diagram.component.html',
  styleUrls: ['./process-diagram.component.scss']
})
export class ProcessDiagramComponent implements OnInit {
  @Input() processList: object[];

  data = [
    {
      "parent": "Data access and ethics",
      "name": "Data access",
      "description": "this is sub-process description: Data access"
    },
    {
      "parent": "Data access and ethics",
      "name": "Data ethics",
      "description": "this is sub-process description: Data ethics"
    },
    {
      "parent": "Competency questions",
      "name": "Data competency",
      "description": "this is sub-process description: Data competency"
    }
  ];

  processes = [
    {
      "name": "Data access and ethics",
      "description": "this is the process description: Data access and ethics",
      "subProcess": []
    },
    {
      "name": "Competency questions",
      "description": "this is the process description: Competency questions",
      "subProcess": [
        {
          "name": "sub Data access and ethics",
          "description": "sub this is the process description: Data access and ethics",
        }
      ]
    }
  ];

  processMap = {};

  title: string;
  description: string;
  subProcessList: object[];
  connectedResources: object[];

  constructor() {
  }

  ngOnInit(): void {
    console.log("Loading proess diagram. Number of processes: " + this.processList.length);
    for (let process of this.processList) {
      if (process['hasParent'] == null || process['hasParent'].length == 0) {
        if (process["id"] in this.processMap) {
          this.processMap[process["id"]]["name"] = process["name"];
          this.processMap[process["id"]]["description"] = process["description"];
        } else {
          this.processMap[process["id"]] = {
            "name": process["name"],
            "description": process["description"],
            "subProcess": []
          }
        }
      } else {
        let parentId = process['hasParent'][0];
        let parentProcess;
        if (parentId in this.processMap) {
          parentProcess = this.processMap[parentId];
        } else {
          parentProcess = {"subProcess": []}
          this.processMap[parentId] = parentProcess;
        }

        if (parentProcess != null) {
          parentProcess.subProcess.push(process);
        }
      }
    }
    console.log(this.processMap);
    this.onSelectProcess("fw:process-data-access-and-retrieval");
  }

  onSelectProcess(processName) {
    let parentProcess = this.processMap[processName];
    if (parentProcess !== undefined) {
      this.title = parentProcess.name;
      this.description = parentProcess.description;
      this.subProcessList = parentProcess.subProcess;
    } else {
      console.log("Process not defined: " + processName);
    }

    this.connectedResources = [];
  }

}
