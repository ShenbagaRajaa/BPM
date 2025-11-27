import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlanLevelState } from './plan-level.state';

export const PlanLevel_STATE_NAME = 'planLevel';

const getPlanLevelState =
  createFeatureSelector<PlanLevelState>(PlanLevel_STATE_NAME);

export const selectAllPlanLevels = createSelector(
  getPlanLevelState,
  (state) => state.PlanLevels
);
export const selectPlanLevel = createSelector(
  getPlanLevelState,
  (state) => state.PlanLevel
);
export const selectPlanLevelError = createSelector(
  getPlanLevelState,
  (state) => state.error
);
export const selectPlanLevelMessage = createSelector(
  getPlanLevelState,
  (state) => state.message
);
