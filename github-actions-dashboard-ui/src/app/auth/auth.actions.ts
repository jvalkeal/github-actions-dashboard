import { createAction, props } from '@ngrx/store';
import { User } from '../api/api.service';

export const login = createAction(
  '[Auth] Login',
  props<{ user: User }>()
);
export const logout = createAction('[Auth] Logout');
export const unauthorised = createAction('[Auth] Unauthorised');
