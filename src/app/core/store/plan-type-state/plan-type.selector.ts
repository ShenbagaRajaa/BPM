import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlanTypeState } from './plan-type.state';

export const PlanType_STATE_NAME = 'planType';

const getPlanTypeState =
  createFeatureSelector<PlanTypeState>(PlanType_STATE_NAME);

export const selectAllPlanTypes = createSelector(
  getPlanTypeState,
  (state) => state.PlanTypes
);
export const selectPlanType = createSelector(
  getPlanTypeState,
  (state) => state.PlanType
);
export const selectPlanTypeError = createSelector(
  getPlanTypeState,
  (state) => state.error
);
export const selectPlanTypeMessage = createSelector(
  getPlanTypeState,
  (state) => state.message
);
