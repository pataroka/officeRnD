import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
