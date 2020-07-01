import { createReducer, createSelector, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';
import * as fromRoot from '../reducers';
import { Dashboard, Card } from '../api/api.service';

export const dashboardsFeatureKey = 'dashboards';

export interface DashboardState {
  global: Dashboard[];
  user: Dashboard[];
  team: Dashboard[];
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

export const getTeamDashboards = (state: State) => {
  return state[dashboardsFeatureKey].team;
};

export const getUserDashboard = createSelector(
  getUserDashboards,
  (dashboards: Dashboard[], props: {search: string}) => dashboards.find(({name}) => name === props.search)
);

export const getTeamDashboard = createSelector(
  getTeamDashboards,
  (dashboards: Dashboard[], props: {search: string}) => dashboards.find(({name}) => name === props.search)
);

export const getCards = (state: State) => {
  return state[dashboardsFeatureKey].cards;
};

const initialState: DashboardState = {
  global: [],
  user: [],
  team: [],
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
      team: state.team,
      cards: state.cards
    };
  }),
  on(DashboardActions.saveTeamOk, (state, dashboard) => {
    return {
      global: state.global,
      user: state.user,
      team: mergeDashboards(state.team, [dashboard.dashboard]),
      cards: state.cards
    };
  }),
  on(DashboardActions.removeOk, (state, dashboard) => {
    return {
      global: state.global,
      user: removeDashboard(state.user, dashboard.dashboard),
      team: state.team,
      cards: state.cards
    };
  }),
  on(DashboardActions.removeTeamOk, (state, dashboard) => {
    return {
      global: state.global,
      user: state.user,
      team: removeDashboard(state.team, dashboard.dashboard),
      cards: state.cards
    };
  }),
  on(DashboardActions.loadGlobal, (state, dashboards) => {
    return {
      global: mergeDashboards(state.global, dashboards.dashboards),
      user: state.user,
      team: state.team,
      cards: state.cards
    };
  }),
  on(DashboardActions.loadUser, (state, dashboards) => {
    return {
      global: state.global,
      user: mergeDashboards(state.user, dashboards.dashboards),
      team: state.team,
      cards: state.cards
    };
  }),
  on(DashboardActions.loadTeam, (state, dashboards) => {
    return {
      global: state.global,
      user: state.user,
      team: mergeDashboards(state.team, dashboards.dashboards),
      cards: state.cards
    };
  }),
  on(DashboardActions.setCards, (state, props) => {
    return {
      global: state.global,
      user: state.user,
      team: state.team,
      cards: props.cards
    };
  }),
  on(DashboardActions.removeCardOk, (state, props) => {
    return {
      global: state.global,
      user: state.user,
      team: state.team,
      cards: state.cards.filter(c =>
        !(c.repository.owner === props.card.repository.owner && c.repository.name === props.card.repository.name)
      )
    };
  })
);
