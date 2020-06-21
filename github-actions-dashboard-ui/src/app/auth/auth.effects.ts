import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {

  updateAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.unauthorised),
      tap(action => {
        this.router.navigate(['/home']);
    })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
