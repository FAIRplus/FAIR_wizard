import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-facet-group',
  templateUrl: './facet-group.component.html',
  styleUrls: ['./facet-group.component.scss']
})
export class FacetGroupComponent implements OnInit {
  @Input() group: string;
  @Input() facets: object;

  constructor() { }

  ngOnInit(): void {
  }

}
