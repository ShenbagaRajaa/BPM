import { createAction, props } from '@ngrx/store';
import { role } from '../../models/role.model';

export const getRoles = createAction('[Role] Get Roles');

export const getRolesSuccess = createAction(
  '[Role] Get Roles Success',
  props<{ roles: role[] }>()
);

export const getRolesFailure = createAction(
  '[Role] Get Roles Failure',
  props<{ error: string }>()
);

export const getRole = createAction(
  '[Role] Get Role',
  props<{ roleId: number }>()
);

export const getRoleSuccess = createAction(
  '[Role] Get Role Success',
  props<{ role: role }>()
);

export const getRoleFailure = createAction(
  '[Role] Get Role Failure',
  props<{ error: string }>()
);

export const addRole = createAction(
  '[Role] Add Role',
  props<{ addRole: role; selectedPermissions: number[] }>()
);

export const addRoleSuccess = createAction(
  '[Role] Add Role Success',
  props<{ message: string }>()
);

export const addRoleFailure = createAction(
  '[Role] Add Role Failure',
  props<{ error: string }>()
);

export const editRole = createAction(
  '[Role] Edit Role',
  props<{ editRole: role; selectedPermissions: number[] }>()
);

export const editRoleSuccess = createAction(
  '[Role] Edit Role Success',
  props<{ message: string }>()
);

export const editRoleFailure = createAction(
  '[Role] Edit Role Failure',
  props<{ error: string }>()
);

export const deleteRole = createAction(
  '[Role] Delete Role',
  props<{ roleId: number; userId: number }>()
);

export const deleteRoleSuccess = createAction(
  '[Role] Delete Role Success',
  props<{ message: string }>()
);

export const deleteRoleFailure = createAction(
  '[Role] Delete Role Failure',
  props<{ error: string }>()
);
