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

export const remove = createAction(
  '[Dispatches] remove',
  props<{ dispatch: Dispatch }>()
);

export const removeError = createAction(
  '[Dispatches] remove error',
  props<{ dispatch: Dispatch }>()
);

export const removeOk = createAction(
  '[Dispatches] remove ok',
  props<{ dispatch: Dispatch }>()
);

export const change = createAction(
  '[Dispatches] change',
  props<{ dispatch: Dispatch }>()
);

export const changeError = createAction(
  '[Dispatches] change error',
  props<{ dispatch: Dispatch }>()
);

export const changeOk = createAction(
  '[Dispatches] change ok',
  props<{ dispatch: Dispatch }>()
);
