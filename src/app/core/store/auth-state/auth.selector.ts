import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

// Define the feature state name for authentication
export const USER_STATE_NAME = 'auth';

// Get the entire authentication state from the store
const getAuthState = createFeatureSelector<AuthState>(USER_STATE_NAME);

// Selector to get the authenticated user and token from the state
export const selectUser = createSelector(getAuthState, (state) => ({
  token: state.token,
  user: state.user,
}));

// Selector to get authentication-related errors from the state
export const selectUseError = createSelector(getAuthState, (state) => {
  return state.error;
});

// Selector to get the permission IDs array from the state
export const getPermissionIds = createSelector(getAuthState, (state) => {
  return state.permissionIds;
});

// Selector to check if an authentication-related process is loading
export const getAuthLoader = createSelector(getAuthState, (state) => {
  return state.loading;
});
