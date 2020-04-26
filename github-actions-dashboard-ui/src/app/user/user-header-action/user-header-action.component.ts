import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from '../../../app/api.service';
import { AuthService } from '../../../app/auth/auth.service';
import { SettingsService } from 'src/app/settings/settings.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

@Component({
  selector: 'app-user-header-action',
  templateUrl: './user-header-action.component.html',
  styleUrls: ['./user-header-action.component.css']
})
export class UserHeaderActionComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  public userLoggedIn: User = {};

  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subs.push(this.authService.userLoggedIn.subscribe(user => {
      this.userLoggedIn = user;
    }));
    this.login();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  login(): void {
    this.subs.push(this.authService.login().subscribe(data => {
      this.router.navigate(['/home']);
      this.settingsService.load().pipe(take(1)).subscribe();
      this.dashboardService.loadGlobal().pipe(take(1)).subscribe();
      this.dashboardService.loadUser().pipe(take(1)).subscribe();
    }));
  }

  logout(): void {
    this.subs.push(this.authService.logout().subscribe(data => {
      this.router.navigate(['/home']);
    }));
  }
}
