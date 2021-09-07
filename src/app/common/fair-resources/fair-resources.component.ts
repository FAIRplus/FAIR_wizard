import {Component, Input, OnInit} from '@angular/core';
import {FairResource, FairResourceType} from "../../models/FairResource";
import {FairResourceProcess} from "../../models/FairResourceProcess";
import {FairResourceIndicator} from "../../models/FairResourceIndicator";
import {FairResourceRecipe} from "../../models/FairResourceRecipe";
import {FairResourceRequirement} from "../../models/FairResourceRequirement";
import {FairResourceTool} from "../../models/FairResourceTool";
import {DecisionService} from "../../decision.service";
import {ProcessDialogComponent} from "../process-dialog/process-dialog.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FairResourceComponent} from "../fair-resource/fair-resource.component";

@Component({
  selector: 'app-fair-resources',
  templateUrl: './fair-resources.component.html',
  styleUrls: ['./fair-resources.component.scss']
})
export class FairResourcesComponent implements OnInit {
  @Input() resources: FairResource[];
  @Input() filters: string[];
  processes: FairResourceProcess[] = [];
  indicators: FairResourceIndicator[] = [];
  recipes: FairResourceRecipe[] = [];
  requirements: FairResourceRequirement[] = [];
  tools: FairResourceTool[] = [];


  constructor(private decisionService: DecisionService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.searchFairResources()
  }

  searchFairResources() {
    this.populateFairResources(this.resources);
  }

  populateFairResources(resources: FairResource[]): void {
    for (let resource of resources) {
      if (resource.resourceType === FairResourceType.process) {
        this.processes.push(resource);
      } else if (resource.resourceType === FairResourceType.indicator) {
        this.indicators.push(resource);
      } else if (resource.resourceType === FairResourceType.recipe) {
        this.recipes.push(resource);
      } else if (resource.resourceType === FairResourceType.requirement) {
        this.requirements.push(resource);
      } else if (resource.resourceType === FairResourceType.tool) {
        this.tools.push(resource);
      }
    }
  }

  openProcessDialog(resource) {
    const modalRef = this.modalService.open(FairResourceComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.resource = resource;
  }

}
