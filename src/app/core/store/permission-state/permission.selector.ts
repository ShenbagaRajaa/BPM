import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PermissionState } from './permission.state';

export const Permission_STATE_NAME = 'permission';

const getPermissionState = createFeatureSelector<PermissionState>(
  Permission_STATE_NAME
);

export const selectAllPermissions = createSelector(
  getPermissionState,
  (state) => state.Permissions
);
export const selectPermission = createSelector(
  getPermissionState,
  (state) => state.Permission
);
export const selectPermissionError = createSelector(
  getPermissionState,
  (state) => state.error
);
export const selectPermissionMessage = createSelector(
  getPermissionState,
  (state) => state.message
);

export const selectPermissionByRoleId = createSelector(
  getPermissionState,
  (state) => {
    return state.permissionByRoleId;
  }
);
