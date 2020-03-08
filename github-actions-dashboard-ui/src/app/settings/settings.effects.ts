import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, exhaustMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SettingsService } from 'src/app/settings/settings.service';
import * as SettingsActions from './settings.actions';

@Injectable()
export class SettingsEffects {

  updateSetting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.update),
      exhaustMap((setting) => this.settingsService.update(setting.setting)
        .pipe(
          map(aVoid => SettingsActions.ok({setting: setting.setting})),
          catchError(() => of(SettingsActions.error({setting: setting.setting})))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private settingsService: SettingsService
  ) {}

}
