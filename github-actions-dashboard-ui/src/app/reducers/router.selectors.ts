import { createSelector } from '@ngrx/store';
import * as fromRoot from './index';

export const selectCardsRouteIdAndTeam = createSelector(
  fromRoot.selectRouteParams,
  fromRoot.selectQueryParams, (r, q) => {
    return { id: r.id, team: q.team};
  }
);
