import {Component, Input, OnInit} from '@angular/core';
import {FairResource, FairResourceType} from "../../models/FairResource";

@Component({
  selector: 'app-fair-resource',
  templateUrl: './fair-resource.component.html',
  styleUrls: ['./fair-resource.component.scss']
})
export class FairResourceComponent implements OnInit {
  @Input() resource: FairResource;

  constructor() { }

  ngOnInit(): void {
  }

  getResourceType(resourceType) {
    return FairResourceType[resourceType];
  }

}
