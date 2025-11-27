import { createFeatureSelector, createSelector } from '@ngrx/store';
import { drTeamState } from './drTeam.state';

export const DRTEAM_STATE_NAME = 'drTeam';

const getSystemState = createFeatureSelector<drTeamState>(DRTEAM_STATE_NAME);

export const selectAllDRTeams = createSelector(
  getSystemState,
  (state) => state.drTeams
);
export const selectDRTeam = createSelector(
  getSystemState,
  (state) => state.drTeam
);
export const selectDRTeamError = createSelector(
  getSystemState,
  (state) => state.error
);
export const selectDRTeamMessage = createSelector(
  getSystemState,
  (state) => state.message
);
