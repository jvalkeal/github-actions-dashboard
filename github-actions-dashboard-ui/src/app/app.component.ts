import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, take, tap } from 'rxjs/operators';
import { State, getLoggedIn } from './auth/auth.reducer';
import { ThemeService } from './theme/theme.service';
import { getThemeActiveSetting, themeActiveKey } from './settings/settings.reducer';
import * as SettingsActions from './settings/settings.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loggedIn$ = this.store.pipe(select(getLoggedIn));
  themeActiveSetting$ = this.store.pipe(select(getThemeActiveSetting));
  darkThemeIsActive = false;

  @Effect({ dispatch: false })
  updateTheme$ = this.actions$.pipe(
    ofType(SettingsActions.load),
    take(1),
    map(action => action.settings.find(s => s.name === themeActiveKey)?.value),
    tap(theme => {
      if (theme) {
        this.themeService.switchTheme(theme);
      }
    })
  ).subscribe();

  @Effect({ dispatch: false })
  updatedSettings$ = this.actions$.pipe(
    ofType(SettingsActions.ok),
    map(action => action.setting),
    tap(setting => {
      if (setting.name === themeActiveKey && setting.value) {
        this.themeService.switchTheme(setting.value);
      }
    })
  ).subscribe();

  constructor(
    private router: Router,
    private store: Store<State>,
    private themeService: ThemeService,
    private actions$: Actions,
  ) {}

  ngOnInit() {
  }

  public goHome(): boolean {
    this.router.navigate(['/home']);
    return false;
  }
}
