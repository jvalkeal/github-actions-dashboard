import { createReducer, on } from '@ngrx/store';
import * as SettingsActions from './settings.actions';
import * as fromRoot from '../reducers';
import { Setting } from '../api.service';

export const settingsFeatureKey = 'settings';

export interface SettingsState {
  settings: Setting[];
}

export interface State extends fromRoot.State {
  [settingsFeatureKey]: SettingsState;
}

export const getSettings = (state: State) => {
  console.log('getSettings1', state);
  const xxx = state.settings.settings;
  console.log('getSettings2', xxx);
  return xxx;
  // return state[settingsFeatureKey];
};

const initialState: SettingsState = {
  settings: []
};

export const reducer = createReducer(
  initialState,
  on(SettingsActions.load, (state, {settings}) => ({ settings }))
  // on(SettingsActions.load, (state, {settings}) => {
  //   console.log('setting2', state, settings);
  //   return ({ settings:  });
  // })
);
