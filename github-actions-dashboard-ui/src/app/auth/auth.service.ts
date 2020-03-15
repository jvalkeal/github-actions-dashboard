import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService, User } from '../api.service';
import { login, logout } from './auth.actions';
import { AuthState } from './auth.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userLoggedIn: BehaviorSubject<User> = new BehaviorSubject<User>({});
  isLoggedIn = false;
  redirectUrl: string;

  constructor(
    private api: ApiService,
    private store: Store<AuthState>
  ) { }

  login(): Observable<User> {
    return this.api.getUser().pipe(
      tap(val => {
        this.isLoggedIn = val.name !== undefined;
        this.userLoggedIn.next(val);
        this.store.dispatch(login());
      }));
  }

  logout(): Observable<boolean> {
    return this.api.logout().pipe(tap(res => {
      if (res) {
        this.isLoggedIn = false;
        this.userLoggedIn.next({});
        this.store.dispatch(logout());
      }
    }));
  }
}
