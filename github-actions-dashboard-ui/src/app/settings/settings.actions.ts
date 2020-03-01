import { createAction, props } from '@ngrx/store';
import { Setting } from '../api.service';

export const load = createAction(
  '[Settings] load',
  props<{ settings: Setting[] }>()
);
