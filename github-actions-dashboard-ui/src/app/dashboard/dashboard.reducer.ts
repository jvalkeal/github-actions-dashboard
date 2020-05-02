import { createReducer, createSelector, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';
import * as fromRoot from '../reducers';
import { Dashboard, Card } from '../api/api.service';

export const dashboardsFeatureKey = 'dashboards';

export interface DashboardState {
  global: Dashboard[];
  user: Dashboard[];
  cards: Card[];
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

export const getUserDashboard = createSelector(
  getUserDashboards,
  (dashboards: Dashboard[], props: {search: string}) => dashboards.find(({name}) => name === props.search)
);

export const getCards = (state: State) => {
  return state[dashboardsFeatureKey].cards;
};

const initialState: DashboardState = {
  global: [],
  user: [],
  cards: []
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
    to.push(v);
  });
  return to;
}

function removeDashboard(dashboards: Dashboard[], dashboard: Dashboard): Dashboard[] {
  const to = [];
  dashboards.forEach( (item, index) => {
    if (item.name !== dashboard.name) {
      to.push(item);
    }
  });
  return to;
}

export const reducer = createReducer(
  initialState,
  on(DashboardActions.ok, (state, dashboard) => {
    return {
      global: state.global,
      user: mergeDashboards(state.user, [dashboard.dashboard]),
      cards: state.cards
    };
  }),
  on(DashboardActions.removeOk, (state, dashboard) => {
    return {
      global: state.global,
      user: removeDashboard(state.user, dashboard.dashboard),
      cards: state.cards
    };
  }),
  on(DashboardActions.loadGlobal, (state, dashboards) => {
    return {
      global: mergeDashboards(state.global, dashboards.dashboards),
      user: state.user,
      cards: state.cards
    };
  }),
  on(DashboardActions.loadUser, (state, dashboards) => {
    return {
      global: state.global,
      user: mergeDashboards(state.user, dashboards.dashboards),
      cards: state.cards
    };
  }),
  on(DashboardActions.setCards, (state, props) => {
    return {
      global: state.global,
      user: state.user,
      cards: props.cards
    };
  }),
  on(DashboardActions.removeCardOk, (state, props) => {
    return {
      global: state.global,
      user: state.user,
      cards: state.cards.filter(c =>
        !(c.repository.owner === props.card.repository.owner && c.repository.name === props.card.repository.name)
      )
    };
  })
);
