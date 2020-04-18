import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions, Effect, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, switchMap } from 'rxjs/operators';
import { DashboardService } from '../../app/dashboard/dashboard.service';
import * as DashboardActions from './dashboard.actions';
import { State } from '../reducers';
import { getUserDashboard } from './dashboard.reducer';
import { Dashboard } from '../api.service';

@Injectable()
export class DashboardEffects {

  saveDashboards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.update),
      exhaustMap((dashboard) => this.dashboardService.save(dashboard.dashboard)
        .pipe(
          map(aVoid => DashboardActions.ok({dashboard: dashboard.dashboard})),
          catchError(() => of(DashboardActions.error({dashboard: dashboard.dashboard})))
        )
      )
    )
  );

  removeDashboards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.remove),
      exhaustMap((dashboard) => this.dashboardService.remove(dashboard.dashboard)
        .pipe(
          map(aVoid => DashboardActions.removeOk({dashboard: dashboard.dashboard})),
          catchError(() => of(DashboardActions.removeError({dashboard: dashboard.dashboard})))
        )
      )
    )
  );

  @Effect({ dispatch: true })
  removeCard$ = this.actions$.pipe(
    ofType(DashboardActions.removeCard),
    switchMap((action) => {
      return this.store.pipe(
        select(getUserDashboard, {search: action.dashboard.name})).pipe(
          map(ud => {
            const dashboard: Dashboard = {
              name: ud.name,
              description: ud.description,
              repositories: ud.repositories.filter(r =>
                !(r.name === action.card.repository.name && r.owner === action.card.repository.owner)
              )
            };
            return dashboard;
          })
      );
    }),
    exhaustMap((dashboard) => this.dashboardService.save(dashboard)
      .pipe(
        map(aVoid => DashboardActions.ok({dashboard})),
        catchError(() => of(DashboardActions.error({dashboard})))
      )
    )
  );

  private removey(dashboard: Dashboard): void {

  }

  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService,
    private store: Store<State>
  ) {}

}
