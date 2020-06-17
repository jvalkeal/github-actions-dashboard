import { createAction } from '@ngrx/store';
import * as fromAlerts from './alerts.reducer';
import * as AlertsActions from './alerts.actions';
import { Alert } from './alerts.service';

describe('Alerts Reducers', () => {

  const alert1: Alert = {
    id: 'id1'
  };

  it('should return init state', () => {
    const initState: fromAlerts.AlertsState = { alerts: []};
    const newState = fromAlerts.reducer(undefined, createAction('fake'));
    expect(newState).toEqual(initState);
  });

  it('should add and remove alert', () => {
    let expectedState: fromAlerts.AlertsState = { alerts: [alert1]};
    let newState = fromAlerts.reducer(undefined, AlertsActions.add({alert: alert1}));
    expect(newState).toEqual(expectedState);
    expectedState = { alerts: []};
    newState = fromAlerts.reducer(undefined, AlertsActions.remove({alert: alert1}));
    expect(newState).toEqual(expectedState);
  });
});
