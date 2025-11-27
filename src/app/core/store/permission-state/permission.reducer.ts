import { createReducer, on } from '@ngrx/store';
import {
  getPermission,
  getPermissionFailure,
  getPermissionSuccess,
  getPermissions,
  getPermissionsByRoleId,
  getPermissionsByRoleIdFailure,
  getPermissionsByRoleIdSuccess,
  getPermissionsFailure,
  getPermissionsSuccess,
} from './permission.action';
import { initialState } from './permission.state';

export const PermissionReducer = createReducer(
  initialState,
  on(getPermissions, (state) => ({
    ...state,
  })),
  on(getPermissionsSuccess, (state, { permissions }) => ({
    ...state,
    Permissions: permissions,
  })),
  on(getPermissionsFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(getPermission, (state) => ({
    ...state,
  })),
  on(getPermissionSuccess, (state, { permission }) => ({
    ...state,
    Permission: permission,
  })),
  on(getPermissionFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(getPermissionsByRoleId, (state) => ({
    ...state,
  })),
  on(getPermissionsByRoleIdSuccess, (state, { permissionByRoleId }) => ({
    ...state,
    permissionByRoleId: permissionByRoleId,
  })),
  on(getPermissionsByRoleIdFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
