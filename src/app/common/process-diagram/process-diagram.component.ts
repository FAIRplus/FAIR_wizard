import {Component, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
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

  openProcessDialog($event) {
    alert("hello");
  }

  showModal(): void {
    // this.displayService.setShowModal(true);
    // communication to show the modal, I use a behaviour subject from a service layer here
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openSeperate(content) {
    const modalRef = this.modalService.open(ProcessDialogComponent, {size: 'xl', centered: true});
    modalRef.componentInstance.name = 'World';
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
