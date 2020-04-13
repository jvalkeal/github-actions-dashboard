import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { tap, map } from 'rxjs/operators';
import { State, getUserDashboards } from '../../dashboard/dashboard.reducer';
import { selectRouteParams } from '../../../app/reducers';
import { remove } from '../../../app/dashboard/dashboard.actions';

/**
 * Modal dialog to delete an existing dashboard.
 */
@Component({
  selector: 'app-modal-delete-dashboard',
  templateUrl: './modal-delete-dashboard.component.html',
  styleUrls: ['./modal-delete-dashboard.component.css']
})
export class ModalDeleteDashboardComponent implements OnInit {

  show = false;
  name = '';
  userDashboards$ = this.store.pipe(select(getUserDashboards));
  form: FormGroup;
  options: string;

  private currentUserCardName = this.store.pipe(
    select(selectRouteParams)
  ).pipe(
    map(params => {
      if (params?.type === 'user') {
        return params.id;
      }
      return null;
    })
  );

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.name, Validators.required)
    });
    this.currentUserCardName.pipe(
      tap(name => {
        this.options = name;
      })
    ).subscribe();
  }

  open(): void {
    this.show = true;
  }

  cancel(): void {
    this.show = false;
  }

  submit(): void {
    if (this.options) {
      this.store.dispatch(remove({ dashboard: { name: this.options, description: '', repositories: []} }));
    }
    this.show = false;
    this.name = '';
  }
}
