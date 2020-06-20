import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ClrForm } from '@clr/angular';
import { Observable, of } from 'rxjs';
import { DispatchesService } from '../dispatches.service';

@Component({
  selector: 'app-modal-send-dispatch',
  templateUrl: './modal-send-dispatch.component.html',
  styleUrls: ['./modal-send-dispatch.component.css']
})
export class ModalSendDispatchComponent implements OnInit {

  show = false;
  form: FormGroup;
  type = '';
  payload = '';
  private owner: string;
  private name: string;
  private typeControl: FormControl;
  private payloadControl: FormControl;

  @ViewChild(ClrForm)
  private clrForm: ClrForm;

  constructor(
    private dispatchesService: DispatchesService
  ) { }

  ngOnInit(): void {
    this.typeControl = new FormControl(this.type, Validators.required);
    this.payloadControl = new FormControl(this.payload, { asyncValidators: this.validJsonValidator() });
    this.form = new FormGroup({
      type: this.typeControl,
      payload: this.payloadControl
    });
  }

  open(owner: string, name: string, eventType: string, clientPayload: string): void {
    this.owner = owner;
    this.name = name;
    this.typeControl.setValue(eventType);
    this.payloadControl.setValue(clientPayload);
    this.clrForm.markAsTouched();
    this.show = true;
  }

  cancel(): void {
    this.show = false;
  }

  submit(): void {
    this.dispatchesService.dispatch(this.owner, this.name, this.type, this.payload);
    this.show = false;
  }

  private validJsonValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if (control.value === null || control.value === '' || control.value === undefined) {
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
