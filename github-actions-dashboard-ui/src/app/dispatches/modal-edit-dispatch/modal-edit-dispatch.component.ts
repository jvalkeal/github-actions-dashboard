import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup, FormControl, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ClrForm, ClrWizard } from '@clr/angular';
import { State } from '../dispatches.reducer';
import { change } from '../dispatches.actions';

@Component({
  selector: 'app-modal-edit-dispatch',
  templateUrl: './modal-edit-dispatch.component.html',
  styleUrls: ['./modal-edit-dispatch.component.css']
})
export class ModalEditDispatchComponent implements OnInit {

  show = false;
  name = '';
  type = '';
  payload = '';
  form2: FormGroup;
  form3: FormGroup;
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
    this.typeControl = new FormControl(this.type, Validators.required);
    this.form2 = new FormGroup({
      type: this.typeControl
    });
    this.payloadControl = new FormControl(this.payload, { asyncValidators: this.validJsonValidator() });
    this.form3 = new FormGroup({
      payload: this.payloadControl
    });
  }

  open(name: string, eventType: string, clientPayload: string): void {
    this.name = name;
    this.typeControl.setValue(eventType);
    this.payloadControl.setValue(clientPayload);
    this.clrForm.markAsTouched();
    this.show = true;
  }

  doCancel(): void {
    this.reset();
  }

  doFinish(): void {
    this.store.dispatch(
      change({
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
    this.name = '';
    this.typeControl.setValue('');
    this.payloadControl.setValue('');
  }

  private validJsonValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if (control.value === null || control.value === '') {
        return of(null);
      } else {
        try {
          JSON.parse(control.value);
          return of(null);
        } catch (error) {
          return of({ invalidJson: control.value });
        }
      }
    };
  }
}
