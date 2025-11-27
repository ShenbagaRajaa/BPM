import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.state';
import {
  login,
  loginSuccess,
  loginFailure,
  logoutFailure,
  logout,
  forgotPassword,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  reloadLogin,
  reloadLoginFailure,
  reloadLoginSuccess,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordFailure,
} from './auth.action';

export const AuthReducer = createReducer(
  initialState,

  // Handle login action (set loading to true)
  on(login, (state) => ({
    ...state,
    loading: true,
  })),

  // Handle login success (store token, user, and permissions)
  on(loginSuccess, (state, { loginResponse }) => ({
    ...state,
    loading: false,
    token: loginResponse.token,
    user: loginResponse.user,
    permissionIds: loginResponse.user.permissionIds.split(','),
  })),

  // Handle login failure (store error message)
  on(loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Handle logout (clear authentication data)
  on(logout, (state) => ({
    ...state,
    loading: false,
    token: '',
    permissionIds: [],
    user: {
      roleId: 0,
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
  })),

  // Handle logout failure (store error message)
  on(logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Handle forgot password request (set loading state)
  on(forgotPassword, (state) => ({
    ...state,
    loading: true,
    error: '',
  })),

  // Handle forgot password success (store success message)
  on(forgotPasswordSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message,
  })),

  // Handle forgot password failure (store error message)
  on(forgotPasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Handle session reload request (set loading state)
  on(reloadLogin, (state) => ({
    ...state,
    loading: true,
  })),

  // Handle successful session reload (update user data)
  on(reloadLoginSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user: user,
    permissionIds: user.permissionIds.split(','),
  })),

  // Handle session reload failure (store error message)
  on(reloadLoginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Handle reset password request (set loading state)
  on(resetPassword, (state) => ({
    ...state,
    loading: true,
    error: '',
  })),

  // Handle reset password success (store success message)
  on(resetPasswordSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message,
  })),

  // Handle reset password failure (store error message)
  on(resetPasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
