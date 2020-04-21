import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State, getLoggedIn } from './auth/auth.reducer';
import { ThemeService } from './theme/theme.service';

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
    private store: Store<State>,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
  }

  public toggleDarkTheme() {
    if (this.darkThemeIsActive) {
      this.themeService.switchTheme('default');
      this.darkThemeIsActive = false;
    } else {
      this.themeService.switchTheme('dark');
      this.darkThemeIsActive = true;
    }
  }

  public goHome(): boolean {
    this.router.navigate(['/home']);
    return false;
  }
}
