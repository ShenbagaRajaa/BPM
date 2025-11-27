import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RoleState } from './role.state';

export const ROLE_STATE_NAME = 'role';

const getRoleState = createFeatureSelector<RoleState>(ROLE_STATE_NAME);

export const selectAllRoles = createSelector(getRoleState, (state) => {
  return state.roles;
});

export const selectRole = createSelector(getRoleState, (state) => {
  return state.role;
});

export const selectRoleError = createSelector(getRoleState, (state) => {
  return state.error;
});

export const selectRoleMessage = createSelector(getRoleState, (state) => {
  return state.message;
});
