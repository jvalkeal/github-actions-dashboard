import { createReducer, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';
import * as fromRoot from '../reducers';
import { Dashboard } from '../api.service';

export const dashboardsFeatureKey = 'dashboards';

export interface DashboardState {
  global: Dashboard[];
  user: Dashboard[];
}

export interface State extends fromRoot.State {
  [dashboardsFeatureKey]: DashboardState;
}

export const getGlobalDashboards = (state: State) => {
  return state[dashboardsFeatureKey].global;
};

export const getUserDashboards = (state: State) => {
  return state[dashboardsFeatureKey].user;
};

const initialState: DashboardState = {
  global: [],
  user: []
};

function mergeDashboards(left: Dashboard[], right: Dashboard[]): Dashboard[] {
  const to = [];
  const toMap = new Map<string, Dashboard>();
  left.forEach(v => {
    toMap.set(v.name, v);
  });
  right.forEach(v => {
    toMap.set(v.name, v);
  });
  toMap.forEach((v, k) => {
    to.push({ name: k, value: v });
  });
  return to;
}

export const reducer = createReducer(
  initialState,
  on(DashboardActions.ok, (state, dashboard) => {
    return {
      global: state.global,
      user: mergeDashboards(state.user, [dashboard.dashboard])
    };
  }),
  on(DashboardActions.loadGlobal, (state, dashboards) => {
    return {
      global: mergeDashboards(state.global, dashboards.dashboards),
      user: state.user
    };
  }),
  on(DashboardActions.loadUser, (state, dashboards) => {
    return {
      global: state.global,
      user: mergeDashboards(state.user, dashboards.dashboards)
    };
  })
);
