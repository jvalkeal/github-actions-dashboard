import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalNewDispatchComponent } from '../modal-new-dispatch/modal-new-dispatch.component';
import { Store, select } from '@ngrx/store';
import { State, getUserDispatches } from '../dispatches.reducer';
import * as DispatchesActions from '../dispatches.actions';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Dispatch } from 'src/app/api/api.service';
import { ModalEditDispatchComponent } from '../modal-edit-dispatch/modal-edit-dispatch.component';
import { DispatchesService } from '../dispatches.service';

@Component({
  selector: 'app-dispatches',
  templateUrl: './dispatches.component.html',
  styleUrls: ['./dispatches.component.css']
})
export class DispatchesComponent implements OnInit {

  loading = true;
  userDispatches = this.dispatchesService.userDispatches();

  @Effect({ dispatch: false })
  refreshCard$ = this.actions$.pipe(
      ofType(DispatchesActions.refreshOk)
    )
    .subscribe(action => {
        this.loading = false;
  });

  @ViewChild(ModalNewDispatchComponent)
  private modalCreateDispatch: ModalNewDispatchComponent;

  @ViewChild(ModalEditDispatchComponent)
  private modalEditDispatch: ModalEditDispatchComponent;

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private dispatchesService: DispatchesService
  ) { }

  ngOnInit(): void {
    this.store.dispatch(DispatchesActions.refresh());
  }

  refresh(): void {
    this.loading = true;
    this.store.dispatch(DispatchesActions.refresh());
  }

  edit(dispatch: Dispatch): void {
    this.modalEditDispatch.open(dispatch.name, dispatch.eventType, JSON.stringify(dispatch.clientPayload));
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
