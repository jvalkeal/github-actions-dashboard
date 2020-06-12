import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalNewDispatchComponent } from '../modal-new-dispatch/modal-new-dispatch.component';
import { Store, select } from '@ngrx/store';
import { State, getUserDispatches } from '../dispatches.reducer';
import * as DispatchesActions from '../dispatches.actions';

@Component({
  selector: 'app-dispatches',
  templateUrl: './dispatches.component.html',
  styleUrls: ['./dispatches.component.css']
})
export class DispatchesComponent implements OnInit {

  loading = false;
  userDispatches = this.store.pipe(select(getUserDispatches));

  @ViewChild(ModalNewDispatchComponent)
  private modalCreateDispatch: ModalNewDispatchComponent;

  constructor(
    private store: Store<State>,
  ) { }

  ngOnInit(): void {
  }

  refresh(): void {
    this.store.dispatch(DispatchesActions.refresh());
  }

  showCreateDispatch(): void {
    this.modalCreateDispatch.open();
  }

}
