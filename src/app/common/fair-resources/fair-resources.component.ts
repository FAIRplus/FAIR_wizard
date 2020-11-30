import {Component, Input, OnInit} from '@angular/core';
import {FairResource, FairResourceType} from "../../models/FairResource";
import {FairResourceProcess} from "../../models/FairResourceProcess";
import {FairResourceIndicator} from "../../models/FairResourceIndicator";
import {FairResourceRecipe} from "../../models/FairResourceRecipe";
import {FairResourceRequirement} from "../../models/FairResourceRequirement";
import {FairResourceTool} from "../../models/FairResourceTool";
import {DecisionService} from "../../decision.service";

@Component({
  selector: 'app-fair-resources',
  templateUrl: './fair-resources.component.html',
  styleUrls: ['./fair-resources.component.scss']
})
export class FairResourcesComponent implements OnInit {
  @Input() resources: FairResource[];
  processes: FairResourceProcess[] = [];
  indicators: FairResourceIndicator[] = [];
  recipes: FairResourceRecipe[] = [];
  requirements: FairResourceRequirement[] = [];
  tools: FairResourceTool[] = [];


  constructor(private decisionService: DecisionService) {
  }

  ngOnInit(): void {
    this.searchFairResources()
  }

  searchFairResources() {
    this.populateFairResources(this.resources);
    // this.decisionService.searchResources().subscribe(r => {
    //   this.populateFairResources(r)
    // });
  }

  populateFairResources(resources: FairResource[]): void {
    for (let resource of resources) {
      console.log(resource.resourceType);
      if (resource.resourceType === FairResourceType.Process) {
        this.processes.push(resource);
      } else if (resource.resourceType === FairResourceType.Indicator) {
        this.indicators.push(resource);
      } else if (resource.resourceType === FairResourceType.Recipe) {
        console.log("Found recipe");
        this.recipes.push(resource);
      } else if (resource.resourceType === FairResourceType.Requirement) {
        this.requirements.push(resource);
      } else if (resource.resourceType === FairResourceType.Tool) {
        this.tools.push(resource);
      }
    }
  }

}
