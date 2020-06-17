import { createReducer, on } from '@ngrx/store';
import * as AlertsActions from './alerts.actions';
import * as fromRoot from '../reducers';
import { Alert } from './alerts.service';

export const alertsFeatureKey = 'alerts';

export interface AlertsState {
  alerts: Alert[];
}

export interface State extends fromRoot.State {
  [alertsFeatureKey]: AlertsState;
}

export const getAlerts = (state: State) => {
  return state[alertsFeatureKey].alerts;
};

const initialState: AlertsState = {
  alerts: []
};

export const reducer = createReducer(
  initialState,
  on(AlertsActions.add, (state, props) => {
    const updated = [...state.alerts];
    const i = updated.findIndex(a => a.id === props.alert.id);
    if (i > -1) {
      updated[i] = props.alert;
    } else {
      updated.push(props.alert);
    }
    return { alerts: updated };
  }),
  on(AlertsActions.remove, (state, props) => {
    return { alerts: state.alerts.filter(a => a.id !== props.alert.id) };
  }),
);
