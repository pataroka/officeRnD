import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-location-cell-renderer',
  templateUrl: './location-cell-renderer.component.html',
  styleUrls: ['./location-cell-renderer.component.scss']
})
export class LocationCellRendererComponent implements ICellRendererAngularComp {

  public location: string;

  public constructor() {}

  public agInit(params: any) {
    this.location = params.value;
  }

  public refresh(params: any): boolean {
    this.location = params.value;

    return true;
  }
}
