import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import * as fromRoot from '../reducers';
import { User } from '../api/api.service';

export const authFeatureKey = 'auth';

export interface AuthState {
  loggedIn: boolean;
  user?: User;
}

export interface State extends fromRoot.State {
  [authFeatureKey]: AuthState;
}

export const getLoggedIn = (state: State) => {
  return state[authFeatureKey].loggedIn;
};

export const getLoggedInUser = (state: State) => {
  return state[authFeatureKey].user;
};

export const initialState: AuthState = {
  loggedIn: false,
};

export const reducer = createReducer(
  initialState,
  on(AuthActions.login, (state, props) => ({ loggedIn: true, user: props.user })),
  on(AuthActions.logout, state => ({ loggedIn: false }))
);
