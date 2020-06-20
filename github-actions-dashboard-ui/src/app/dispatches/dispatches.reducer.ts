import { createReducer, on } from '@ngrx/store';
import * as DispatchesActions from './dispatches.actions';
import * as fromRoot from '../reducers';
import { Dispatch } from '../api/api.service';

export const dispatchesFeatureKey = 'dispatches';

export interface DispatchesState {
  dispatches: Dispatch[];
}

export interface State extends fromRoot.State {
  [dispatchesFeatureKey]: DispatchesState;
}

export const getUserDispatches = (state: State) => {
  return state[dispatchesFeatureKey].dispatches;
};

const initialState: DispatchesState = {
  dispatches: []
};

function mergeDispatches(left: Dispatch[], right: Dispatch[]): Dispatch[] {
  const to = [];
  const toMap = new Map<string, Dispatch>();
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

function updateDispatches(dispatches: Dispatch[], dispatch: Dispatch): Dispatch[] {
  const to: Dispatch[] = [];
  dispatches.forEach(v => {
    if (v.name === dispatch.name) {
      to.push({
        name: v.name,
        eventType: dispatch.eventType,
        clientPayload: dispatch.clientPayload ? JSON.parse(dispatch.clientPayload) : undefined });
    } else {
      to.push({ name: v.name, eventType: v.eventType, clientPayload: v.clientPayload });
    }
  });
  return to;
}

export const reducer = createReducer(
  initialState,
  on(DispatchesActions.load, (state, props) => {
    return { dispatches: mergeDispatches(state.dispatches, props.dispatches) };
  }),
  on(DispatchesActions.refreshOk, (state, props) => {
    return { dispatches: mergeDispatches(state.dispatches, props.dispatches) };
  }),
  on(DispatchesActions.updateOk, (state, props) => {
    return { dispatches: mergeDispatches(state.dispatches, [props.dispatch]) };
  }),
  on(DispatchesActions.removeOk, (state, props) => {
    return { dispatches: state.dispatches.filter(d => d.name !== props.dispatch.name) };
  }),
  on(DispatchesActions.changeOk, (state, props) => {
    return { dispatches: updateDispatches(state.dispatches, props.dispatch) };
  })
);
