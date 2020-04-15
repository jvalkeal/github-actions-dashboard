import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { runCssVarsPolyfill } from '@clr/core/common';
import { State, getLoggedIn } from './auth/auth.reducer';

const darkThemeStyleSheet = document.styleSheets[4];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loggedIn$ = this.store.pipe(select(getLoggedIn));
  private darkThemeIsActive = false;

  constructor(
    private router: Router,
    private store: Store<State>
  ) {}

  ngOnInit() {
    darkThemeStyleSheet.disabled = true;
  }

  public toggleDarkTheme() {
    darkThemeStyleSheet.disabled = !(this.darkThemeIsActive = !this.darkThemeIsActive);
    runCssVarsPolyfill();
  }

  public goHome(): boolean {
    this.router.navigate(['/home']);
    return false;
  }
}
