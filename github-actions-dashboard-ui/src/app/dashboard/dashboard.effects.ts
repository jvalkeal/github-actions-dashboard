import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DashboardService } from '../../app/dashboard/dashboard.service';
import * as DashboardActions from './dashboard.actions';

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

  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService
  ) {}

}
