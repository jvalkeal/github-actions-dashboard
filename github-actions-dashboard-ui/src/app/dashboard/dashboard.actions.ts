import { createAction, props } from '@ngrx/store';
import { Dashboard, Card } from '../api/api.service';

export const loadGlobal = createAction(
  '[Dashboard] load global',
  props<{ dashboards: Dashboard[] }>()
);

export const loadUser = createAction(
  '[Dashboard] load user',
  props<{ dashboards: Dashboard[] }>()
);

export const remove = createAction(
  '[Dashboard] remove',
  props<{ dashboard: Dashboard }>()
);

export const removeCard = createAction(
  '[Dashboard] remove card',
  props<{ dashboard: Dashboard, card: Card }>()
);

export const removeCardOk = createAction(
  '[Dashboard] remove card ok',
  props<{ dashboard: Dashboard, card: Card }>()
);

export const removeCardError = createAction(
  '[Dashboard] remove card error',
  props<{ dashboard: Dashboard, card: Card }>()
);

export const refreshCard = createAction(
  '[Dashboard] refresh card',
  props<{}>()
);

export const setCards = createAction(
  '[Dashboard] set cards',
  props<{ dashboard: Dashboard, cards: Card[] }>()
);

export const removeOk = createAction(
  '[Dashboard] remove ok',
  props<{ dashboard: Dashboard }>()
);

export const removeError = createAction(
  '[Dashboard] remove error',
  props<{ dashboard: Dashboard }>()
);

export const save = createAction(
  '[Dashboard] save',
  props<{ dashboard: Dashboard }>()
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
