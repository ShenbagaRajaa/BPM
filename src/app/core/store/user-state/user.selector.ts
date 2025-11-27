import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';
export const USER_STATE_NAME = 'user';

const getUserState = createFeatureSelector<UserState>(USER_STATE_NAME);

export const selectAllUsers = createSelector(getUserState, (state) => {
  return state.users;
});

export const selectUserByEmail = createSelector(getUserState, (state) => {
  return state.user;
});

export const selectUserByRoleId = createSelector(getUserState, (state) => {
  return state.usersByRole;
});

export const selectUserError = createSelector(getUserState, (state) => {
  return state.error;
});

export const selectDrTeam = createSelector(getUserState, (state) => {
  return state.drTeam;
});

export const selectDrSkill = createSelector(getUserState, (state) => {
  return state.drSkill;
});

export const selectUserByEmployeeName = createSelector(
  getUserState,
  (state: UserState, props: { employeeName: string }) =>
    state.users.find((user) => user.employeeFirstName === props.employeeName) ||
    null
);
