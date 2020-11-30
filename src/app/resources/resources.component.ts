import { Component, OnInit } from '@angular/core';
import {FairResource} from "../models/FairResource";
import {DecisionService} from "../decision.service";

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  fairResources: FairResource[];

  constructor(private decisionService: DecisionService) { }

  ngOnInit(): void {
    this.searchResources();
  }

  searchResources(): void {
    this.decisionService.searchResources().subscribe(r => this.fairResources = r);
  }
}
