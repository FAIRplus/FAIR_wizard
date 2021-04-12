import {Component, OnInit} from '@angular/core';
import {FairResource} from "../../models/FairResource";
import {DecisionService} from "../../decision.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-fair-resources-showcase',
  templateUrl: './fair-resources-showcase.component.html',
  styleUrls: ['./fair-resources-showcase.component.scss']
})
export class FairResourcesShowcaseComponent implements OnInit {
  fairResources: FairResource[];
  searchFilters: string[];

  facets = {
    "Labels": {"Findability": 10, "Accessibility": 10, "Interoperability": 10, "Reusability": 10},
    "Impact": {"High +": 10, "Medium +": 10, "Low +": 10},
    "Maturity Level": {"Assessment": 10, "Design": 10, "Implementation": 10},
    "Annotation type": {"Manual": 5, "Automatic": 30}
  }

  constructor(private decisionService: DecisionService, private route: ActivatedRoute) {
  }

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

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
}
