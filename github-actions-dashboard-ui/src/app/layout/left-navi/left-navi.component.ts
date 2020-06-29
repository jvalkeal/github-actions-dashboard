import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  State, getGlobalDashboards, getUserDashboards, getTeamDashboards
} from '../../dashboard/dashboard.reducer';

@Component({
  selector: 'app-left-navi',
  templateUrl: './left-navi.component.html',
  styleUrls: ['./left-navi.component.css']
})
export class LeftNaviComponent implements OnInit {

  globalDashboards = this.store.pipe(select(getGlobalDashboards));
  userDashboards = this.store.pipe(select(getUserDashboards));
  teamDashboards = this.store.pipe(select(getTeamDashboards));
  collapsible = true;

  constructor(
    private store: Store<State>
  ) {}

  ngOnInit(): void {
  }
}
