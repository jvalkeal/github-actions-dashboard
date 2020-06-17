import { createAction, props } from '@ngrx/store';
import { Alert } from './alerts.service';

export const add = createAction(
  '[Alerts] add',
  props<{ alert: Alert }>()
);

export const remove = createAction(
  '[Alerts] remove',
  props<{ alert: Alert }>()
);

export const command = createAction(
  '[Alerts] command',
  props<{ alert: Alert, command: string, args: string[] }>()
);
