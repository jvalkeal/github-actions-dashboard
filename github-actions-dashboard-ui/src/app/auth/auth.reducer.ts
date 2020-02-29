import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import * as fromRoot from '../reducers';

export const authFeatureKey = 'auth';

export interface AuthState {
  loggedIn: boolean;
}

export interface State extends fromRoot.State {
  [authFeatureKey]: AuthState;
}

export const getLoggedIn = (state: AuthState) => {
  return state[authFeatureKey].loggedIn;
};

const initialState: AuthState = {
  loggedIn: false,
};

export const reducer = createReducer(
  initialState,
  on(AuthActions.login, state => ({ loggedIn: true })),
  on(AuthActions.logout, state => ({ loggedIn: false }))
);
