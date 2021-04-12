import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.scss']
})
export class FacetComponent implements OnInit {
  private checked: boolean;
  @Input() attribute: string;
  @Input() count: number;

  constructor() { }

  ngOnInit(): void {
  }

}
