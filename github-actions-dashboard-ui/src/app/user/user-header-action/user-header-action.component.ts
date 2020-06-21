import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from '../../api/api.service';
import { AuthService } from '../../auth/auth.service';
import { SettingsService } from '../../settings/settings.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { DispatchesService } from '../../dispatches/dispatches.service';

@Component({
  selector: 'app-user-header-action',
  templateUrl: './user-header-action.component.html',
  styleUrls: ['./user-header-action.component.css']
})
export class UserHeaderActionComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  userLoggedIn = this.authService.loggedInUser();

  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
    private dashboardService: DashboardService,
    private dispatchesService: DispatchesService,
    private router: Router
  ) { }

  ngOnInit() {
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
      this.dispatchesService.refresh();
    }));
  }

  logout(): void {
    this.subs.push(this.authService.logout().subscribe(data => {
      this.router.navigate(['/home']);
    }));
  }
}
