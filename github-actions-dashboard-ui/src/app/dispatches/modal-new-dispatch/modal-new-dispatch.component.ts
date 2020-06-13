import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State, getUserDispatches } from '../dispatches.reducer';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClrForm, ClrWizard } from '@clr/angular';
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
  // form: FormGroup;
  // userDispatches$ = this.store.pipe(select(getUserDispatches));
  private nameControl: FormControl;

  @ViewChild(ClrForm, {static: true})
  private clrForm: ClrForm;

  @ViewChild(ClrWizard)
  private wizard: ClrWizard;

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit(): void {
    // this.nameControl = new FormControl(this.name, Validators.required/*, existingNameValidator(this.userDashboards$)*/);
    // this.form = new FormGroup({
    //   name: this.nameControl
    // });
  }

  open(): void {
    this.show = true;
  }

  edit(name: string): void {
    this.name = name;
    this.show = true;
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
    // this.selectedRepository = null;
    // this.selectedBranches = [];
  }
}
