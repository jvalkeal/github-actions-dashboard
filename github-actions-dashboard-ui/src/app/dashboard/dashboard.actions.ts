import { createAction, props } from '@ngrx/store';
import { Dashboard } from '../api.service';

export const loadGlobal = createAction(
  '[Dashboard] load global',
  props<{ dashboards: Dashboard[] }>()
);

export const loadUser = createAction(
  '[Dashboard] load user',
  props<{ dashboards: Dashboard[] }>()
);

export const update = createAction(
  '[Dashboard] update',
  props<{ dashboard: Dashboard }>()
);

export const error = createAction(
  '[Dashboard] update error',
  props<{ dashboard: Dashboard }>()
);

export const ok = createAction(
  '[Dashboard] update ok',
  props<{ dashboard: Dashboard }>()
);
