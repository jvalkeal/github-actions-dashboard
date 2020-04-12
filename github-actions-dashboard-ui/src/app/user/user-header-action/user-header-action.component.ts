import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../app/api.service';
import { AuthService } from '../../../app/auth/auth.service';
import { SettingsService } from '../../../app/settings/settings.service';
import { DashboardService } from '../../../app/dashboard/dashboard.service';

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
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
    if (this.sub3) {
      this.sub3.unsubscribe();
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
      this.dashboardService.loadUser().subscribe(d => {
        console.log('dashboards users', d);
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
