import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCellRendererComponent } from 'src/app/components/member-cell-renderer/member-cell-renderer.component';

describe('DateCellRendererComponent', () => {
  let component: MemberCellRendererComponent;
  let fixture: ComponentFixture<MemberCellRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
