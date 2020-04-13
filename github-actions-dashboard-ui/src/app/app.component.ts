import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State, getLoggedIn } from './auth/auth.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loggedIn$ = this.store.pipe(select(getLoggedIn));

  constructor(
    private router: Router,
    private store: Store<State>
  ) {}

  ngOnInit() {
  }

  public goHome(): boolean {
    this.router.navigate(['/home']);
    return false;
  }
}
