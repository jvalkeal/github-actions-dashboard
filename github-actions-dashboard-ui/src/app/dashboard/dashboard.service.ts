import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService, Dashboard } from '../api.service';
import { DashboardState } from './dashboard.reducer';
import { load, loadUser } from './dashboard.actions';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private api: ApiService,
    private store: Store<DashboardState>
  ) { }

  load(): Observable<Dashboard[]> {
    return this.api.getDashboards().pipe(
      tap(val => {
        this.store.dispatch(load({ dashboards: val }));
      }));
  }

  loadUser(): Observable<Dashboard[]> {
    return this.api.getUserDashboards().pipe(
      tap(val => {
        this.store.dispatch(loadUser({ dashboards: val }));
      }));
  }

  save(dashboard: Dashboard): Observable<void> {
    return this.api.saveDashboard(dashboard);
  }
}
