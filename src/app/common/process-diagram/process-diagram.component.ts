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
      "subProcess": []
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
        let parentId = process['hasParent'][0]["id"];
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

    this.onSelectProcess("fw:process-data-access-and-ethics");
  }

  onSelectProcess(processName) {
    let parentProcess = this.processMap[processName];
    this.title = parentProcess.name;
    this.description = parentProcess.description;
    this.subProcessList = parentProcess.subProcess;
    this.connectedResources = [];
  }

}
