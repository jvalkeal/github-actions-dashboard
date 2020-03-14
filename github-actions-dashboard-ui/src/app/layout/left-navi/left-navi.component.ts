import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State, getDashboards } from '../../dashboard/dashboard.reducer';

@Component({
  selector: 'app-left-navi',
  templateUrl: './left-navi.component.html',
  styleUrls: ['./left-navi.component.css']
})
export class LeftNaviComponent implements OnInit {

  dashboards$ = this.store.pipe(select(getDashboards));
  collapsible = true;

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit(): void {
  }

}
