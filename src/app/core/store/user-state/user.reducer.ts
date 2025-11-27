import { createReducer, on } from '@ngrx/store';
import { initialState } from './user.state';
import {
  addUser,
  addUserFailure,
  addUserSuccess,
  clearUser,
  deleteUser,
  deleteUserFailure,
  deleteUserSuccess,
  getAllUser,
  getAllUserFailure,
  getAllUserSuccess,
  getDrSkill,
  getDrSkillFailure,
  getDrSkillSuccess,
  getDrTeam,
  getDrTeamFailure,
  getDrTeamSuccess,
  getUserByEmail,
  getUserByEmailFailure,
  getUserByEmailSuccess,
  getUserByRoleId,
  getUserByRoleIdFailure,
  getUserByRoleIdSuccess,
  unlockUserAccount,
  unlockUserAccountFailure,
  unlockUserAccountSuccess,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from './user.action';

export const UserReducer = createReducer(
  initialState,

  on(getAllUser, (state) => ({
    ...state,
    loading: true,
    snackbarState: {
      loader: true,
    },
  })),
  on(getAllUserSuccess, (state, { users }) => ({
    ...state,
    loading: false,
    users,
    snackbarState: {
      loader: false,
    },
  })),
  on(getAllUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    snackbarState: {
      loader: false,
    },
  })),

  on(getUserByEmail, (state) => ({
    ...state,
    loading: true,
    snackbarState: {
      loader: true,
    },
  })),
  on(getUserByEmailSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
    snackbarState: {
      loader: false,
    },
  })),
  on(getUserByEmailFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    snackbarState: {
      loader: false,
    },
  })),

  on(addUser, (state) => ({
    ...state,
    loading: true,
  })),
  on(addUserSuccess, (state, { users }) => ({
    ...state,
    loading: false,
    users,
  })),
  on(addUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(updateUser, (state) => ({
    ...state,
    loading: true,
  })),
  on(updateUserSuccess, (state, { users }) => ({
    ...state,
    loading: false,
    users,
  })),
  on(updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(getDrTeam, (state) => ({
    ...state,
    loading: true,
  })),
  on(getDrTeamSuccess, (state, { drTeam }) => ({
    ...state,
    loading: false,
    drTeam,
  })),
  on(getDrTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(getDrSkill, (state) => ({
    ...state,
    loading: true,
  })),
  on(getDrSkillSuccess, (state, { drSkill }) => ({
    ...state,
    loading: false,
    drSkill,
  })),
  on(getDrSkillFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(getUserByRoleId, (state) => ({
    ...state,
    loading: true,
  })),
  on(getUserByRoleIdSuccess, (state, { usersByRole }) => ({
    ...state,
    loading: false,
    usersByRole: (usersByRole || [])
      .filter((member) => member.isActive)
      .map(({ id, employeeFirstName, employeeLastName }) => ({
        id,
        employeeFirstName,
        employeeLastName,
      })),
  })),
  on(getUserByRoleIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(deleteUser, (state) => ({
    ...state,
    loading: false,
  })),
  on(deleteUserSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(unlockUserAccount, (state) => ({
    ...state,
    loading: false,
  })),
  on(unlockUserAccountSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(unlockUserAccountFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(clearUser, (state) => ({
    ...state,
    loading: false,
    token: '',
    permissionIds: [],
    user: {
      id: 0,
      title: '',
      employeeFirstName: '',
      employeeLastName: '',
      drTeamId: 0,
      drTeamSkill: '',
      email: '',
      mobileNumber: '',
      role: 0,
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      emergencyContactName: '',
      emergencyContactEmail: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      isActive: true,
      profilePicture: null,
      address2: '',
      createdBy: 0,
      uploadPhotoPath: '',
      isPasswordReset: undefined,
      permissionIds: '',
      accountLocked: undefined,
      lastChangedBy: 0,
    },
  }))
);
