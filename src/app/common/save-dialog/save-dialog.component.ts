import {Component, Input, OnInit} from '@angular/core';
import {wizardMetadata} from "../../models/SavedSearch";

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss']
})
export class SaveDialogComponent implements OnInit {
  @Input() wizardMetadata: wizardMetadata;

  constructor() { }

  ngOnInit(): void {
  }

  save() {

  }

}
