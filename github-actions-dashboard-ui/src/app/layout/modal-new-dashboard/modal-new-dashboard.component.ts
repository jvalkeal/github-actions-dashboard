import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ClrForm } from '@clr/angular';
import { State, getUserDashboards } from '../../dashboard/dashboard.reducer';
import { save } from '../../dashboard/dashboard.actions';
import { Dashboard } from '../../api/api.service';

/**
 * Modal dialog to add a new dashboard.
 */
@Component({
  selector: 'app-modal-new-dashboard',
  templateUrl: './modal-new-dashboard.component.html',
  styleUrls: ['./modal-new-dashboard.component.css']
})
export class ModalNewDashboardComponent implements OnInit {

  show = false;
  name = '';
  form: FormGroup;
  userDashboards$ = this.store.pipe(select(getUserDashboards));

  private nameControl: FormControl;

  @ViewChild(ClrForm, {static: true})
  private clrForm: ClrForm;

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit(): void {
    this.nameControl = new FormControl(this.name, Validators.required, existingNameValidator(this.userDashboards$));
    this.form = new FormGroup({
      name: this.nameControl
    });
  }

  open(): void {
    this.clrForm.markAsTouched();
    this.show = true;
  }

  cancel(): void {
    this.show = false;
  }

  submit(): void {
    this.store.dispatch(save({ dashboard: { name: this.name, description: '', repositories: []} }));
    this.show = false;
    this.name = '';
  }
}

function existingNameValidator(dashboards: Observable<Dashboard[]>): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (control.value === null || control.value === 0) {
      // this validator only checks if value exists
      return of(null);
    } else {
      // check if given name is already in a state
      return dashboards.pipe(
        take(1),
        map(d => d.some(item => item.name === control.value) ? { duplicateName: control.value } : null)
      );
    }
  };
}
