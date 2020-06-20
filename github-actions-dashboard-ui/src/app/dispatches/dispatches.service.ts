import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService, Dispatch } from '../api/api.service';
import { getUserDispatches } from './dispatches.reducer';
import { load, update } from './dispatches.actions';
import * as fromRoot from '../reducers';
import * as DispatchesActions from './dispatches.actions';

@Injectable({
  providedIn: 'root'
})
export class DispatchesService {

  constructor(
    private api: ApiService,
    private store: Store<fromRoot.State>
  ) { }

  dispatch(owner: string, name: string, eventType: string, clientPayload: any): void {
    this.api.sendDispatch(owner, name, eventType, clientPayload).subscribe();
  }

  refresh(): void {
    this.store.dispatch(DispatchesActions.refresh());
  }

  load(): Observable<Dispatch[]> {
    return this.api.getUserDispatches().pipe(
      tap(val => {
        this.store.dispatch(load({ dispatches: val }));
      }));
  }

  userDispatches(): Observable<Dispatch[]> {
    return this.store.pipe(select(getUserDispatches));
  }

  update(dispatch: Dispatch): Observable<void> {
    return this.api.updateDispatch(dispatch);
  }

  updateAction(dispatch: Dispatch): void {
    this.store.dispatch(update({dispatch}));
  }

  remove(dispatch: Dispatch): Observable<void> {
    return this.api.removeDispatch(dispatch);
  }

  change(dispatch: Dispatch): Observable<void> {
    return this.api.changeDispatch(dispatch);
  }
}
