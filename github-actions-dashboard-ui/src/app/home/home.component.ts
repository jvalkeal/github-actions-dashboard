import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loggedIn$ = this.authService.loggedIn();
  dashboards$ = this.dashboardService.getDashboards();

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
  }

}
