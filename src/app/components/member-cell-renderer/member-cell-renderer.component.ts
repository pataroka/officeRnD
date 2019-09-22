import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-date-cell-renderer',
  templateUrl: './member-cell-renderer.component.html',
  styleUrls: [ './member-cell-renderer.component.scss']
})
export class MemberCellRendererComponent implements ICellRendererAngularComp {

  public imgUrl: string;
  public name: string;

  public constructor() {}

  public agInit(params: any) {
    this.name = params.value;
    this.imgUrl = params.data.image;
  }

  public refresh(params: any): boolean {
    this.name = params.value;
    this.imgUrl = params.data.image;

    return true;
  }

}
