import { PlanState } from './plan.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
export const PLAN_STATE_NAME = 'plan';

const getPlanState = createFeatureSelector<PlanState>(PLAN_STATE_NAME);

export const selectAllPlans = createSelector(getPlanState, (state) => {
  return state.plans;
});

export const selectPlansError = createSelector(getPlanState, (state) => {
  return state.error;
});

export const selectPlanById = createSelector(getPlanState, (state) => {
  return state.plan;
});

export const getPlanIdentifier = createSelector(getPlanState, (state) => {
  return state.message;
});

export const selectPlansByStatus = createSelector(getPlanState, (state) => {
  return state.plansByStatus;
});
