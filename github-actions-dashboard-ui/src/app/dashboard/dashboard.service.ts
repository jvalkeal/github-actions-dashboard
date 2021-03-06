import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService, Dashboard, Team } from '../api/api.service';
import { State, getAllDashboards, Dashboards } from './dashboard.reducer';
import { loadGlobal, loadUser, loadTeam } from './dashboard.actions';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private api: ApiService,
    private store: Store<State>
  ) { }

  loadGlobal(): Observable<Dashboard[]> {
    return this.api.getGlobalDashboards().pipe(
      tap(val => {
        this.store.dispatch(loadGlobal({ dashboards: val }));
      }));
  }

  loadUser(): Observable<Dashboard[]> {
    return this.api.getUserDashboards().pipe(
      tap(val => {
        this.store.dispatch(loadUser({ dashboards: val }));
      }));
  }

  loadTeam(): Observable<Dashboard[]> {
    return this.api.getTeamDashboards().pipe(
      tap(val => {
        this.store.dispatch(loadTeam({ dashboards: val }));
      }));
  }

  getDashboards(): Observable<Dashboards> {
    return this.store.pipe(select(getAllDashboards));
  }

  save(dashboard: Dashboard): Observable<void> {
    return this.api.saveDashboard(dashboard);
  }

  saveTeam(team: string, dashboard: Dashboard): Observable<void> {
    return this.api.saveTeamDashboard(team, dashboard);
  }

  remove(dashboard: Dashboard): Observable<void> {
    return this.api.removeDashboard(dashboard);
  }

  removeTeam(team: string, dashboard: Dashboard): Observable<void> {
    return this.api.removeTeamDashboard(team, dashboard);
  }

  teams(): Observable<Team[]> {
    return this.api.getTeams();
  }
}
