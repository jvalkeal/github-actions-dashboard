import { createReducer, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';
import * as fromRoot from '../reducers';
import { Dashboard } from '../api.service';

export const dashboardsFeatureKey = 'dashboards';

export interface DashboardState {
  dashboards: Dashboard[];
}

export interface State extends fromRoot.State {
  [dashboardsFeatureKey]: DashboardState;
}

export const getDashboards = (state: State) => {
  return state[dashboardsFeatureKey].dashboards;
};

const initialState: DashboardState = {
  dashboards: []
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
  on(DashboardActions.load, (state, dashboards) => {
    return { dashboards: mergeDashboards(state.dashboards, dashboards.dashboards) };
  })
);
