import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getLoggedIn, State } from '../auth/auth.reducer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loggedIn$ = this.store.pipe(select(getLoggedIn));

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
  }

}
