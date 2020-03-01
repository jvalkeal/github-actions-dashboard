import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getSettings, State } from '../settings.reducer';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settings$ = this.store.pipe(select(getSettings));

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
  }

}
