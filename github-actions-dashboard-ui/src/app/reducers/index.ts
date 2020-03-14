import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
// import * as fromRouter from '@ngrx/router-store';
import { environment } from '../../environments/environment';
import * as fromAuth from '../auth/auth.reducer';
import * as fromSettings from '../settings/settings.reducer';
import * as fromDashboard from '../dashboard/dashboard.reducer';

export interface State {
  [fromAuth.authFeatureKey]: fromAuth.AuthState;
  [fromSettings.settingsFeatureKey]: fromSettings.SettingsState;
  [fromDashboard.dashboardsFeatureKey]: fromDashboard.DashboardState;
  // router: fromRouter.RouterReducerState<any>;
}

export const reducers: ActionReducerMap<State> = {
  [fromAuth.authFeatureKey]: fromAuth.reducer,
  [fromSettings.settingsFeatureKey]: fromSettings.reducer,
  [fromDashboard.dashboardsFeatureKey]: fromDashboard.reducer
  // router: fromRouter.routerReducer
};

function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();
    return result;
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger]
  : [];
