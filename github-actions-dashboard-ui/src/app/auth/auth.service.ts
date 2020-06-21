import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService, User } from '../api/api.service';
import { login, logout } from './auth.actions';
import { State, getLoggedIn, getLoggedInUser } from './auth.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private api: ApiService,
    private store: Store<State>
  ) { }

  login(): Observable<User> {
    return this.api.getUser().pipe(
      tap(val => {
        this.store.dispatch(login({user: val}));
      }));
  }

  logout(): Observable<boolean> {
    return this.api.logout().pipe(tap(res => {
      if (res) {
        this.store.dispatch(logout());
      }
    }));
  }

  loggedIn(): Observable<boolean> {
    return this.store.pipe(select(getLoggedIn));
  }

  loggedInUser(): Observable<User> {
    return this.store.pipe(select(getLoggedInUser));
  }
}
