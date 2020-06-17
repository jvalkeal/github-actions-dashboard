import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as AlertsActions from './alerts.actions';

@Injectable()
export class AlertsEffects {

  @Effect({ dispatch: false })
  commands$ = this.actions$.pipe(
    ofType(AlertsActions.command),
    tap(action => {
      if (action.args.length === 1 && action.args[0]) {
        window.open(action.args[0], '_blank');
      }
    })
  );

  constructor(
    private actions$: Actions,
  ) {}
}
