import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationCellRendererComponent } from './location-cell-renderer.component';

describe('LocationCellRendererComponent', () => {
  let component: LocationCellRendererComponent;
  let fixture: ComponentFixture<LocationCellRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
