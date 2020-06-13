import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalNewDispatchComponent } from '../modal-new-dispatch/modal-new-dispatch.component';
import { Store, select } from '@ngrx/store';
import { State, getUserDispatches } from '../dispatches.reducer';
import * as DispatchesActions from '../dispatches.actions';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Dispatch } from 'src/app/api/api.service';

@Component({
  selector: 'app-dispatches',
  templateUrl: './dispatches.component.html',
  styleUrls: ['./dispatches.component.css']
})
export class DispatchesComponent implements OnInit {

  loading = true;
  userDispatches = this.store.pipe(select(getUserDispatches));

  @Effect({ dispatch: false })
  refreshCard$ = this.actions$.pipe(
      ofType(DispatchesActions.refreshOk)
    )
    .subscribe(action => {
        this.loading = false;
  });

  @ViewChild(ModalNewDispatchComponent)
  private modalCreateDispatch: ModalNewDispatchComponent;

  constructor(
    private store: Store<State>,
    private actions$: Actions
  ) { }

  ngOnInit(): void {
    this.store.dispatch(DispatchesActions.refresh());
  }

  refresh(): void {
    this.loading = true;
    this.store.dispatch(DispatchesActions.refresh());
  }

  edit(dispatch: Dispatch): void {
    console.log('edit', dispatch);
    this.modalCreateDispatch.edit(dispatch.name);
  }

  change(dispatch: Dispatch): void {
    this.store.dispatch(DispatchesActions.change({ dispatch }));
  }

  remove(dispatch: Dispatch): void {
    this.store.dispatch(DispatchesActions.remove({ dispatch }));
  }

  showCreateDispatch(): void {
    this.modalCreateDispatch.open();
  }
}
