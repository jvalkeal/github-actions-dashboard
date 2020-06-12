import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService, Dispatch } from '../api/api.service';
import { DispatchesState } from './dispatches.reducer';
import { load } from './dispatches.actions';

@Injectable({
  providedIn: 'root'
})
export class DispatchesService {

  constructor(
    private api: ApiService,
    private store: Store<DispatchesState>
  ) { }

  load(): Observable<Dispatch[]> {
    return this.api.getUserDispatches().pipe(
      tap(val => {
        this.store.dispatch(load({ dispatches: val }));
      }));
  }

  update(dispatch: Dispatch): Observable<void> {
    return this.api.updateDispatch(dispatch);
  }
}
