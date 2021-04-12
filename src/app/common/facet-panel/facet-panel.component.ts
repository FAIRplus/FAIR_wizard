import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-facet-panel',
  templateUrl: './facet-panel.component.html',
  styleUrls: ['./facet-panel.component.scss']
})
export class FacetPanelComponent implements OnInit {
  @Input() facetGroups: object;

  constructor() { }

  ngOnInit(): void {
  }

}
