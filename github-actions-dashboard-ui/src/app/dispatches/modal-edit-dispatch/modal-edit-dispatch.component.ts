import { Component, OnInit, ViewChild, QueryList } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State, getUserDispatches } from '../dispatches.reducer';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClrForm, ClrWizard } from '@clr/angular';
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
  // userDispatches$ = this.store.pipe(select(getUserDispatches));
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
    this.typeControl = new FormControl(this.type, Validators.required);
    this.form2 = new FormGroup({
      type: this.typeControl
    });
    this.payloadControl = new FormControl(this.payload);
    this.form3 = new FormGroup({
      payload: this.payloadControl
    });
  }

  open(name: string, eventType: string, clientPayload: string): void {
    this.show = true;
    this.name = name;
    this.type = eventType;
    this.payload = clientPayload;
    this.clrForm.markAsTouched();
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
    this.type = '';
    this.payload = '';
  }

}
