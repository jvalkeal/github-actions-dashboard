import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService, Setting } from '../api.service';
import { SettingsState } from './settings.reducer';
import { load } from './settings.actions';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private api: ApiService,
    private store: Store<SettingsState>
  ) { }

  load(): Observable<Setting[]> {
    return this.api.getSettings().pipe(
      tap(val => {
        this.store.dispatch(load({ settings: val }));
      }));
  }

  update(setting: Setting): Observable<void> {
    return this.api.updateSetting(setting);
  }

}
