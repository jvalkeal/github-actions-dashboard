import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, User } from 'src/app/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/settings/settings.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

@Component({
  selector: 'app-user-header-action',
  templateUrl: './user-header-action.component.html',
  styleUrls: ['./user-header-action.component.css']
})
export class UserHeaderActionComponent implements OnInit, OnDestroy {

  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;
  public userLoggedIn: User = {};

  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit() {
    this.sub1 = this.authService.userLoggedIn.subscribe(user => {
      console.log('new user', user);
      this.userLoggedIn = user;
    });
    this.login();
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

  login(): void {
    this.sub2 = this.authService.login().subscribe(data => {
      this.router.navigate(['/cards']);
      this.settingsService.load().subscribe(d => {
        console.log('settings', d);
      });
      this.dashboardService.load().subscribe(d => {
        console.log('dashboards', d);
      });
    });
  }

  logout(): void {
    console.log('trying to logout');
    this.authService.logout().subscribe(data => {
      console.log('navigate', data);
      this.router.navigate(['/home']);
    });
  }

  settings(): void {
    this.router.navigate(['/settings']);
  }
}
