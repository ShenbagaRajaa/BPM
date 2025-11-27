import { createFeatureSelector, createSelector } from '@ngrx/store';
import { appState } from './app.state';

// Creating the feature selector for the app state
export const getAppState = createFeatureSelector<appState>('app');

export const getSnackbarState = createSelector(getAppState, (state) => {
  state.snackbar;
});

export const getPlanState = createSelector(getAppState, (state) => {
  state.plan;
});

export const getSequenceState = createSelector(getAppState, (state) => {
  state.sequence;
});

export const getTaskState = createSelector(getAppState, (state) => {
  state.task;
});

export const getUserState = createSelector(getAppState, (state) => {
  state.user;
});

export const getAuthState = createSelector(getAppState, (state) => {
  state.auth;
});

export const getCountryState = createSelector(getAppState, (state) => {
  state.country;
});

export const getSiteState = createSelector(getAppState, (state) => {
  state.site;
});

export const getDepartmentState = createSelector(getAppState, (state) => {
  state.department;
});

export const getSystemState = createSelector(getAppState, (state) => {
  state.system;
});

export const getPlanTypeState = createSelector(getAppState, (state) => {
  state.planType;
});

export const getPlanLevelState = createSelector(getAppState, (state) => {
  state.planLevel;
});

export const getRoleState = createSelector(getAppState, (state) => {
  state.planLevel;
});

export const getPermission = createSelector(getAppState, (state) => {
  state.permission;
});

export const getPermissionState = createSelector(getAppState, (state) => {
  state.permission;
});

export const getSkillsState=createSelector(getAppState,(state)=>{
  state.skills;
})

export const getConfigurationState=createSelector(getAppState,(state)=>{
  state.configuration
})
export const getSystemTypeState = createSelector(getAppState, (state) => {
  state.systemType;
});

export const getDRTeamState = createSelector(getAppState, (state) => {
  state.drTeam;
});
