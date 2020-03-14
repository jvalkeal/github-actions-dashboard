import { createAction, props } from '@ngrx/store';
import { Dashboard } from '../api.service';

export const load = createAction(
  '[Dashboard] load',
  props<{ dashboards: Dashboard[] }>()
);
