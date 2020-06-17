import { ActionReducer, ActionReducerMap, MetaReducer, createFeatureSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { environment } from '../../environments/environment';
import * as fromAuth from '../auth/auth.reducer';
import * as fromSettings from '../settings/settings.reducer';
import * as fromDashboard from '../dashboard/dashboard.reducer';
import * as fromDispatches from '../dispatches/dispatches.reducer';
import * as fromAlerts from '../alerts/alerts.reducer';

export interface State {
  [fromAuth.authFeatureKey]: fromAuth.AuthState;
  [fromSettings.settingsFeatureKey]: fromSettings.SettingsState;
  [fromDashboard.dashboardsFeatureKey]: fromDashboard.DashboardState;
  [fromDispatches.dispatchesFeatureKey]: fromDispatches.DispatchesState;
  [fromAlerts.alertsFeatureKey]: fromAlerts.AlertsState;
  router: fromRouter.RouterReducerState<any>;
}

export const reducers: ActionReducerMap<State> = {
  [fromAuth.authFeatureKey]: fromAuth.reducer,
  [fromSettings.settingsFeatureKey]: fromSettings.reducer,
  [fromDashboard.dashboardsFeatureKey]: fromDashboard.reducer,
  [fromDispatches.dispatchesFeatureKey]: fromDispatches.reducer,
  [fromAlerts.alertsFeatureKey]: fromAlerts.reducer,
  router: fromRouter.routerReducer
};

export const selectRouter = createFeatureSelector<
  State,
  fromRouter.RouterReducerState<any>
>('router');

export const {
  selectCurrentRoute,
  selectRouteParam,
  selectRouteParams
} = fromRouter.getSelectors(selectRouter);

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
