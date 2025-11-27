import { createAction, props } from '@ngrx/store';
import { loginResponse } from '../../models/loginResponse.model';
import { addUserModel } from '../../models/UserCreationTemp.model';

// Action to initiate the login process
export const login = createAction(
  '[Auth] login',
  props<{ userName: string; passWord: string }>()
);

// Action triggered when login is successful
export const loginSuccess = createAction(
  '[Auth] login success',
  props<{ loginResponse: loginResponse }>()
);

// Action triggered when login fails
export const loginFailure = createAction(
  '[Auth] login failure',
  props<{ error: string }>()
);

// Action to log out the user
export const logout = createAction('[Auth] logout success');

// Action triggered when logout fails
export const logoutFailure = createAction(
  '[Auth] logout failure',
  props<{ error: string }>()
);

// Action to initiate the forgot password process
export const forgotPassword = createAction(
  '[Auth] Forgot Password',
  props<{ email: string }>()
);

// Action triggered when forgot password request is successful
export const forgotPasswordSuccess = createAction(
  '[Auth] Forgot Password Success',
  props<{ message: string }>()
);

// Action triggered when forgot password request fails
export const forgotPasswordFailure = createAction(
  '[Auth] Forgot Password Failure',
  props<{ error: string }>()
);

// Action to reload login session for a user
export const reloadLogin = createAction(
  '[Auth] reload login',
  props<{ email: string }>()
);

// Action triggered when reload login is successful
export const reloadLoginSuccess = createAction(
  '[Auth] reload login success',
  props<{ user: addUserModel }>()
);

// Action triggered when reload login fails
export const reloadLoginFailure = createAction(
  '[Auth] reload login failure',
  props<{ error: string }>()
);

// Action to reset the user's password
export const resetPassword = createAction(
  '[Auth] Reset Password',
  props<{
    token: string;
    newPassword: string;
    ipAddress: string;
    CTAOptIn?: boolean;
  }>()
);

// Action triggered when password reset is successful
export const resetPasswordSuccess = createAction(
  '[Auth] Reset Password Success',
  props<{ message: string }>()
);

// Action triggered when password reset fails
export const resetPasswordFailure = createAction(
  '[Auth] Reset Password Failure',
  props<{ error: string }>()
);
