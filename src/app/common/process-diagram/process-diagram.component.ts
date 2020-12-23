import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProcessDialogComponent} from "../process-dialog/process-dialog.component";

@Component({
  selector: 'app-process-diagram',
  templateUrl: './process-diagram.component.html',
  styleUrls: ['./process-diagram.component.scss']
})
export class ProcessDiagramComponent implements OnInit {
  title = 'appBootstrap';

  closeResult: string;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  openProcessDialog(content) {
    const modalRef = this.modalService.open(ProcessDialogComponent, {size: 'xl', centered: true});
    modalRef.componentInstance.name = content;
  }

}
