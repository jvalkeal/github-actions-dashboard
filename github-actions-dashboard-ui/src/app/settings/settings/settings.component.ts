import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getSettings, State, getRefreshSetting, refreshKey } from '../settings.reducer';
import { update } from '../settings.actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settings$ = this.store.pipe(select(getSettings));
  refreshSetting$ = this.store.pipe(select(getRefreshSetting));

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
  }

  refreshOnChange(val: string) {
    this.store.dispatch(update({ setting: { name: refreshKey, value: val} }));
  }
}
