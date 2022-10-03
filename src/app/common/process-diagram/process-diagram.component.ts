import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProcessDialogComponent} from "../process-dialog/process-dialog.component";
import {DecisionService} from "../../decision.service";
import {FairResourceComponent} from "../fair-resource/fair-resource.component";

@Component({
  selector: 'app-process-diagram',
  templateUrl: './process-diagram.component.html',
  styleUrls: ['./process-diagram.component.scss']
})
export class ProcessDiagramComponent implements OnInit {
  @Input() processList: object[];
  processMap = {};
  parentProcesses = [];

  title: string;
  description: string;
  subProcessList: object[];

  constructor(public decisionService: DecisionService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    console.log("Loading process diagram. Number of processes: " + this.processList.length);
    this.decisionService.getParentProcesses()
      .subscribe(p => {
        this.parentProcesses = p;
        this.onSelectProcess(this.parentProcesses[0]);
      });

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
  }

  onSelectProcess(process) {
    this.title = process.name;
    this.description = process.description;
    this.subProcessList = process.children;
  }

  openProcessDialog(resource) {
    const modalRef = this.modalService.open(FairResourceComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.resource = resource;
  }

}
