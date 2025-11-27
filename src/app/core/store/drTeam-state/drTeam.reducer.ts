import { createReducer, on } from '@ngrx/store';
import {
  getDRTeams,
  getDRTeamsSuccess,
  getDRTeamsFailure,
  addDRTeam,
  addDRTeamFailure,
  addDRTeamSuccess,
  deleteDRTeam,
  deleteDRTeamFailure,
  deleteDRTeamSuccess,
  editDRTeam,
  editDRTeamFailure,
  editDRTeamSuccess,
  getDRTeam,
  getDRTeamFailure,
  getDRTeamSuccess,
} from './drTeam.action';
import { initialState } from './drTeam.state';

export const DRTeamReducer = createReducer(
  initialState,
  on(getDRTeams, (state) => ({
    ...state,
    loading: false,
  })),
  on(getDRTeamsSuccess, (state, { drTeams }) => ({
    ...state,
    loading: false,
    drTeams: drTeams,
  })),
  on(getDRTeamsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(getDRTeam, (state) => ({
    ...state,
    loading: false,
  })),
  on(getDRTeamSuccess, (state, { drTeam }) => ({
    ...state,
    loading: false,
    drTeam,
  })),
  on(getDRTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(addDRTeam, (state) => ({
    ...state,
    loading: false,
  })),
  on(addDRTeamSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message,
  })),
  on(addDRTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(editDRTeam, (state) => ({
    ...state,
    loading: false,
  })),
  on(editDRTeamSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message,
  })),
  on(editDRTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(deleteDRTeam, (state) => ({
    ...state,
    loading: false,
  })),
  on(deleteDRTeamSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message,
  })),
  on(deleteDRTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
