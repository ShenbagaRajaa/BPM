import { createAction, props } from '@ngrx/store';
import { permission } from '../../models/permissions.model';
import { permissionByRole } from '../../models/permissionByRole.model';

export const getPermissions = createAction('[Permission] Get Permissions');

export const getPermissionsSuccess = createAction(
  '[Permission] Get Permissions Success',
  props<{ permissions: permission[] }>()
);

export const getPermissionsFailure = createAction(
  '[Permission] Get Permissions Failure',
  props<{ error: string }>()
);

export const getPermission = createAction(
  '[Permission] Get Permission',
  props<{ permissionId: number }>()
);

export const getPermissionSuccess = createAction(
  '[Permission] Get Permission Success',
  props<{ permission: permission }>()
);

export const getPermissionFailure = createAction(
  '[Permission] Get Permission Failure',
  props<{ error: string }>()
);

export const getPermissionsByRoleId = createAction(
  '[Permission] Get Permission By Role Id',
  props<{ roleId: number }>()
);

export const getPermissionsByRoleIdSuccess = createAction(
  '[Permission] Get Permission By Role Id Success',
  props<{ permissionByRoleId: permission[] }>()
);

export const getPermissionsByRoleIdFailure = createAction(
  '[Permission] Get Permission By Role Id Failure',
  props<{ error: string }>()
);

export const addPermission = createAction(
  '[Permission] Add Permission',
  props<{ addPermission: permissionByRole }>()
);

export const addPermissionSuccess = createAction(
  '[Permission] Add Permission Success',
  props<{ permissions: permission[] }>()
);

export const addPermissionFailure = createAction(
  '[Permission] Add Permission Failure',
  props<{ error: string }>()
);

export const editPermission = createAction(
  '[Permission] Edit Permission',
  props<{ editPermission: permissionByRole }>()
);

export const editPermissionSuccess = createAction(
  '[Permission] Edit Permission Success',
  props<{ permissions: permission[] }>()
);

export const editPermissionFailure = createAction(
  '[Permission] Edit Permission Failure',
  props<{ error: string }>()
);

export const deletePermission = createAction(
  '[Permission] Delete Permission',
  props<{ PermissionId: number; userId: number }>()
);

export const deletePermissionSuccess = createAction(
  '[Permission] Delete Permission Success',
  props<{ permissions: permission[] }>()
);

export const deletePermissionFailure = createAction(
  '[Permission] Delete Permission Failure',
  props<{ error: string }>()
);
