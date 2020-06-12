import { createAction, props } from '@ngrx/store';
import { Dispatch } from '../api/api.service';

export const refresh = createAction(
  '[Dispatches] refresh'
);

export const refreshError = createAction(
  '[Dispatches] refresh error'
);

export const refreshOk = createAction(
  '[Dispatches] refresh ok',
  props<{ dispatches: Dispatch[] }>()
);

export const load = createAction(
  '[Dispatches] load',
  props<{ dispatches: Dispatch[] }>()
);

export const update = createAction(
  '[Dispatches] update',
  props<{ dispatch: Dispatch }>()
);

export const error = createAction(
  '[Dispatches] update error',
  props<{ dispatch: Dispatch }>()
);

export const ok = createAction(
  '[Dispatches] update ok',
  props<{ dispatch: Dispatch }>()
);
