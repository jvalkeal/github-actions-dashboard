import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';
import { ApiService, User } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userLoggedIn: BehaviorSubject<User> = new BehaviorSubject<User>({});
  isLoggedIn = false;
  redirectUrl: string;

  constructor(private api: ApiService) { }

  login(): Observable<User> {
    return this.api.getUser().pipe(
      tap(val => {
        this.isLoggedIn = val.name !== undefined;
        this.userLoggedIn.next(val);
      }));
  }

  logout(): Observable<boolean> {
    return this.api.logout().pipe(tap(res => {
      console.log('logout1()', res);
      if (res) {
        this.isLoggedIn = false;
        console.log('logout2()', res);
        this.userLoggedIn.next({});
      }
    }));
  }
}
