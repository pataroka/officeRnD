import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MemberStatus } from '@enums/member-status.enum';

@Component({
  selector: 'app-status-cell-renderer',
  templateUrl: './status-cell-renderer.component.html',
  styleUrls: ['./status-cell-renderer.component.scss']
})
export class StatusCellRendererComponent implements ICellRendererAngularComp {

  public status: string;

  public memberStatus: typeof MemberStatus = MemberStatus;

  public constructor() {}

  public agInit(params: any) {
    this.status = params.value;
  }

  public refresh(params: any): boolean {
    this.status = params.value;

    return true;
  }

}
