import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ClrForm, ClrWizard } from '@clr/angular';
import { State } from '../dispatches.reducer';
import { update } from '../dispatches.actions';

@Component({
  selector: 'app-modal-new-dispatch',
  templateUrl: './modal-new-dispatch.component.html',
  styleUrls: ['./modal-new-dispatch.component.css']
})
export class ModalNewDispatchComponent implements OnInit {

  show = false;
  name = '';
  type = '';
  payload = '';
  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  private nameControl: FormControl;
  private typeControl: FormControl;
  private payloadControl: FormControl;

  @ViewChild(ClrForm)
  private clrForm: ClrForm;

  @ViewChild(ClrWizard)
  private wizard: ClrWizard;

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit(): void {
    this.nameControl = new FormControl(this.name, Validators.required/*, existingNameValidator(this.userDashboards$)*/);
    this.form1 = new FormGroup({
      name: this.nameControl
    });
    this.typeControl = new FormControl(this.type, Validators.required);
    this.form2 = new FormGroup({
      type: this.typeControl
    });
    this.payloadControl = new FormControl(this.payload);
    this.form3 = new FormGroup({
      payload: this.payloadControl
    });
  }

  open(): void {
    this.show = true;
    this.clrForm.markAsTouched();
  }

  doCancel(): void {
    this.reset();
  }

  doFinish(): void {
    this.store.dispatch(
      update({
        dispatch: {
          name: this.name,
          eventType: this.type,
          clientPayload: this.payload
        }
      })
    );
    this.reset();
  }

  private reset(): void {
    this.wizard.reset();
    this.nameControl.setValue('');
    this.typeControl.setValue('');
    this.payloadControl.setValue('');
  }
}
