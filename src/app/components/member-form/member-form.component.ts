import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core';
import { OfficeInterface } from '@interfaces/office.interface';
import { TeamInterface } from '@interfaces/team.interface';
import { Validators } from '@angular/forms';
import { NgbDateCustomParserFormatter } from '@utilities/ngb-date-custom-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { MemberInterface } from '@interfaces/member.interface';
import { formatNgbDateToString } from '@utilities/ngb-utils';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.scss'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}]
})
export class MemberFormComponent implements OnInit {
  @Input() offices: OfficeInterface[] = [];
  @Input() teams: TeamInterface[] = [];

  public form: FormGroup;

  constructor(
      public activeModal: NgbActiveModal,
      public fb: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.createForm();
  }

  public formatFormValue(formValue: any): MemberInterface {
    return {
      ...formValue,
      startDate: formatNgbDateToString(formValue.startDate)
    };
  }



  private createForm(): void {
    this.form = this.fb.group({
      name: [null, Validators.required],
      team: [null, Validators.required],
      office: [null, Validators.required],
      email: [null],
      phone: [null],
      startDate: [null],
    });
  }
}
