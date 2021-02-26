import {Component, Input, OnInit} from '@angular/core';
import {FairResource} from "../models/FairResource";
import {DecisionService} from "../decision.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  fairResources: FairResource[];
  searchFilters: string[];

  constructor(private decisionService: DecisionService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.searchFilters = [];
    this.fairResources = [];
    this.searchResources();
  }

  searchResources(): void {
    const filters = this.route.snapshot.queryParamMap.getAll('text');
    this.searchFilters = filters.map(f => f.trim());
    console.log(this.searchFilters);
    this.search(filters);
  }

  search(filters: string[]) {
    this.decisionService.searchResources(filters).subscribe(r => this.fairResources = r);
  }

  getFiltersAsString() {
    let filtersAsString = '';
    this.searchFilters.forEach(f => filtersAsString + ' ' + f);
    return filtersAsString.trim;
  }
}
