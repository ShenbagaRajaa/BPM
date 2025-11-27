import { createReducer, on } from '@ngrx/store';
import {
  addRole,
  addRoleFailure,
  addRoleSuccess,
  deleteRole,
  deleteRoleFailure,
  deleteRoleSuccess,
  editRole,
  editRoleFailure,
  editRoleSuccess,
  getRole,
  getRoleFailure,
  getRoleSuccess,
  getRoles,
  getRolesFailure,
  getRolesSuccess,
} from './role.action';
import { initialState } from './role.state';

export const RoleReducer = createReducer(
  initialState,

  on(getRoles, (state) => ({
    ...state,
    loading: false,
  })),
  on(getRolesSuccess, (state, { roles }) => ({
    ...state,
    loading: false,
    roles: roles,
  })),
  on(getRolesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(getRole, (state) => ({
    ...state,
    loading: false,
  })),
  on(getRoleSuccess, (state, { role }) => ({
    ...state,
    loading: false,
    role: role,
  })),
  on(getRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(addRole, (state) => ({
    ...state,
    loading: false,
  })),
  on(addRoleSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message,
  })),
  on(addRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(editRole, (state) => ({
    ...state,
    loading: false,
  })),
  on(editRoleSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message,
  })),
  on(editRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(deleteRole, (state) => ({
    ...state,
    loading: false,
  })),
  on(deleteRoleSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message,
  })),
  on(deleteRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
