import { createAction, props } from '@ngrx/store';
import { addUserModel } from '../../models/UserCreationTemp.model';
import { drTeam } from '../../models/drTeam.model';
import { drSkill } from '../../models/drSkill.model';

export const getAllUser = createAction('[User] get all user');

export const getAllUserSuccess = createAction(
  '[User] get all user success',
  props<{ users: addUserModel[] }>()
);

export const getAllUserFailure = createAction(
  '[User] get all user failure',
  props<{ error: string }>()
);

export const getUserByEmail = createAction(
  '[User] get all user by email',
  props<{ email: string }>()
);

export const getUserByEmployeeName = createAction(
  '[User] get all user by name',
  props<{ employeeName: string }>()
);

export const getUserByEmailSuccess = createAction(
  '[User] get all user by email success',
  props<{ user: addUserModel }>()
);

export const getUserByEmailFailure = createAction(
  '[User] get all user by email failure',
  props<{ error: string }>()
);

export const addUser = createAction(
  '[User] add user',
  props<{ addUser: addUserModel }>()
);

export const addUserSuccess = createAction(
  '[User] add user success',
  props<{ users: addUserModel[] }>()
);

export const addUserFailure = createAction(
  '[User] add user failure',
  props<{ error: string }>()
);

export const updateUser = createAction(
  '[User] update user',
  props<{ updateUser: addUserModel }>()
);

export const updateUserSuccess = createAction(
  '[User] update user success',
  props<{ users: addUserModel[] }>()
);

export const updateUserFailure = createAction(
  '[User] update user failure',
  props<{ error: string }>()
);

export const getDrTeam = createAction(
  '[User] get DrTeam Name',
  props<{ id: number }>()
);

export const getDrTeamSuccess = createAction(
  '[User] get DrTeam Name success',
  props<{ drTeam: drTeam[] }>()
);

export const getDrTeamFailure = createAction(
  '[User] get DrTeam Name failure',
  props<{ error: string }>()
);

export const getDrSkill = createAction(
  '[User] get DrSkill',
  props<{ id: number }>()
);

export const getDrSkillSuccess = createAction(
  '[User] get DrSkill success',
  props<{ drSkill: drSkill[] }>()
);

export const getDrSkillFailure = createAction(
  '[User] get DrSkill failure',
  props<{ error: string }>()
);

export const getUserByRoleId = createAction(
  '[User] get user by role Id',
  props<{ roleId: number }>()
);

export const getUserByRoleIdSuccess = createAction(
  '[User] get user by role Id success',
  props<{ usersByRole: addUserModel[] }>()
);

export const getUserByRoleIdFailure = createAction(
  '[User] get user by role Id failure',
  props<{ error: string }>()
);

export const clearUser = createAction('[User] logout success');

export const deleteUser = createAction(
  '[User] Delete User',
  props<{ userId: number }>()
);

export const deleteUserSuccess = createAction('[User] Delete User Success');

export const deleteUserFailure = createAction(
  '[User] Delete User Failure',
  props<{ error: string }>()
);

export const unlockUserAccount = createAction(
  '[User] Unlock User Account',
  props<{ email : string }>()
);

export const unlockUserAccountSuccess = createAction('[User] Unlock User Account Success');

export const unlockUserAccountFailure = createAction(
  '[User] Unlock User Account Failure',
  props<{ error: string }>()
);