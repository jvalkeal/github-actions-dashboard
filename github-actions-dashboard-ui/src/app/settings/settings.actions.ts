import { createAction, props } from '@ngrx/store';
import { Setting } from '../api/api.service';

export const load = createAction(
  '[Settings] load',
  props<{ settings: Setting[] }>()
);

export const update = createAction(
  '[Setting] update',
  props<{ setting: Setting }>()
);

export const error = createAction(
  '[Setting] update error',
  props<{ setting: Setting }>()
);

export const ok = createAction(
  '[Setting] update ok',
  props<{ setting: Setting }>()
);
