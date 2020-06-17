import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../reducers';
import { getAlerts } from './alerts.reducer';
import { add, remove, command } from './alerts.actions';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(
    private store: Store<fromRoot.State>
  ) { }

  alerts(): Observable<Alert[]> {
    return this.store.pipe(select(getAlerts));
  }

  add(alert: Alert) {
    this.store.dispatch(add({ alert }));
  }

  remove(alert: Alert) {
    this.store.dispatch(remove({ alert }));
  }

  fixCommand(alert: Alert) {
    this.store.dispatch(command({ alert, command: alert.fixCommand, args: [alert.fixCommandRepo] }));
  }
}

export interface Alert {
  id: string;
  alertType?: string;
  text?: string;
  fixCommand?: string;
  fixCommandRepo?: string;
}
