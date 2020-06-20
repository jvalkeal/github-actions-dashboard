import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DispatchesService } from './dispatches.service';
import * as DispatchesActions from './dispatches.actions';

@Injectable()
export class DispatchesEffects {

  updateDispatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DispatchesActions.update),
      exhaustMap((props) => this.dispatchesService.update(props.dispatch)
        .pipe(
          map(aVoid => DispatchesActions.updateOk({
              dispatch: { name: props.dispatch.name,
              eventType: props.dispatch.eventType,
              clientPayload: props.dispatch.clientPayload ? JSON.parse(props.dispatch.clientPayload) : undefined
            }})),
          catchError(() => of(DispatchesActions.updateError({ dispatch: props.dispatch })))
        )
      )
    )
  );

  refreshDispatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DispatchesActions.refresh),
      exhaustMap((props) => this.dispatchesService.load()
        .pipe(
          map(dispatches => DispatchesActions.refreshOk({ dispatches })),
          catchError(() => of(DispatchesActions.refreshError()))
        )
      )
    )
  );

  removeDispatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DispatchesActions.remove),
      exhaustMap((props) => this.dispatchesService.remove(props.dispatch)
        .pipe(
          map(aVoid => DispatchesActions.removeOk({ dispatch: props.dispatch })),
          catchError(() => of(DispatchesActions.removeError({ dispatch: props.dispatch })))
        )
      )
    )
  );

  changeDispatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DispatchesActions.change),
      exhaustMap((props) => this.dispatchesService.change(props.dispatch)
        .pipe(
          map(aVoid => DispatchesActions.changeOk({ dispatch: props.dispatch })),
          catchError(() => of(DispatchesActions.changeError({ dispatch: props.dispatch })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private dispatchesService: DispatchesService
  ) {}
}
