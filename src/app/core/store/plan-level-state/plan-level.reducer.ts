import { createReducer, on } from '@ngrx/store';
import {
  getPlanLevels,
  getPlanLevelsSuccess,
  getPlanLevelsFailure,
  addPlanLevel,
  addPlanLevelFailure,
  addPlanLevelSuccess,
  deletePlanLevel,
  deletePlanLevelFailure,
  deletePlanLevelSuccess,
  editPlanLevel,
  editPlanLevelFailure,
  editPlanLevelSuccess,
  getPlanLevel,
  getPlanLevelFailure,
  getPlanLevelSuccess,
} from './plan-level.action';
import { initialState } from './plan-level.state';

export const PlanLevelReducer = createReducer(
  initialState,
  on(getPlanLevels, (state) => ({
    ...state,
    loading: false,
  })),
  on(getPlanLevelsSuccess, (state, { planLevels }) => ({
    ...state,
    loading: false,
    PlanLevels: planLevels,
  })),
  on(getPlanLevelsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(getPlanLevel, (state) => ({
    ...state,
    loading: false,
  })),
  on(getPlanLevelSuccess, (state, { planLevel }) => ({
    ...state,
    loading: false,
    PlanLevel: planLevel,
  })),
  on(getPlanLevelFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(addPlanLevel, (state) => ({
    ...state,
    loading: false,
  })),
  on(addPlanLevelSuccess, (state, { planLevels }) => ({
    ...state,
    loading: false,
    planLevels,
  })),
  on(addPlanLevelFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(editPlanLevel, (state) => ({
    ...state,
    loading: false,
  })),
  on(editPlanLevelSuccess, (state, { planLevels }) => ({
    ...state,
    loading: false,
    planLevels,
  })),
  on(editPlanLevelFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(deletePlanLevel, (state) => ({
    ...state,
    loading: false,
  })),
  on(deletePlanLevelSuccess, (state, { planLevels }) => ({
    ...state,
    loading: false,
    planLevels,
  })),
  on(deletePlanLevelFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
