import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions, Effect, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, switchMap } from 'rxjs/operators';
import { DashboardService } from '../../app/dashboard/dashboard.service';
import * as DashboardActions from './dashboard.actions';
import { State } from '../reducers';
import { getUserDashboard } from './dashboard.reducer';
import { Dashboard, Repository } from '../api.service';

@Injectable()
export class DashboardEffects {

  saveDashboards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.save),
      exhaustMap((action) => this.dashboardService.save(action.dashboard)
        .pipe(
          map(aVoid => DashboardActions.ok({dashboard: action.dashboard})),
          catchError(() => of(DashboardActions.error({dashboard: action.dashboard})))
        )
      )
    )
  );

  updateDashboards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.update),
      switchMap((action) => {
        return this.store.pipe(
          select(getUserDashboard, {search: action.dashboard.name})).pipe(
            map(ud => {
              const toMap = new Map<string, Repository>();
              ud.repositories.forEach(v => toMap.set(v.name, v));
              action.dashboard.repositories.forEach(v => toMap.set(v.name, v));
              const repositories: Repository[] = [];
              toMap.forEach((v, k) => {
                repositories.push(v);
              });
              const dashboard: Dashboard = {
                name: ud.name,
                description: ud.description,
                repositories
              };
              return dashboard;
            })
        );
      }),
      exhaustMap((dashboard) => this.dashboardService.save(dashboard)
        .pipe(
          switchMap(aVoid => [
            DashboardActions.ok({dashboard}),
            DashboardActions.refreshCard({})
          ]),
          catchError(() => of(DashboardActions.error({dashboard})))
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
            return { dashboard, card: action.card };
          })
      );
    }),
    exhaustMap((v) => this.dashboardService.save(v.dashboard)
      .pipe(
        map(aVoid => DashboardActions.removeCardOk({ dashboard: v.dashboard, card: v.card })),
        catchError(() => of(DashboardActions.removeCardError({ dashboard: v.dashboard, card: v.card })))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService,
    private store: Store<State>
  ) {}
}
