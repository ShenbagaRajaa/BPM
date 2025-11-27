import { createReducer, on } from '@ngrx/store';
import {
  getPlanTypes,
  getPlanTypesSuccess,
  getPlanTypesFailure,
  addPlanType,
  addPlanTypeFailure,
  addPlanTypeSuccess,
  deletePlanType,
  deletePlanTypeFailure,
  deletePlanTypeSuccess,
  editPlanType,
  editPlanTypeFailure,
  editPlanTypeSuccess,
  getPlanType,
  getPlanTypeFailure,
  getPlanTypeSuccess,
} from './plan-type.action';
import { initialState } from './plan-type.state';

export const PlanTypeReducer = createReducer(
  initialState,
  on(getPlanTypes, (state) => ({
    ...state,
    loading: false,
  })),
  on(getPlanTypesSuccess, (state, { planTypes }) => ({
    ...state,
    loading: false,
    PlanTypes: planTypes,
  })),
  on(getPlanTypesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(getPlanType, (state) => ({
    ...state,
    loading: false,
  })),
  on(getPlanTypeSuccess, (state, { planType }) => ({
    ...state,
    loading: false,
    PlanType: planType,
  })),
  on(getPlanTypeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(addPlanType, (state) => ({
    ...state,
    loading: false,
  })),
  on(addPlanTypeSuccess, (state, { planTypes }) => ({
    ...state,
    loading: false,
    planTypes,
  })),
  on(addPlanTypeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(editPlanType, (state) => ({
    ...state,
    loading: false,
  })),
  on(editPlanTypeSuccess, (state, { planTypes }) => ({
    ...state,
    loading: false,
    planTypes,
  })),
  on(editPlanTypeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(deletePlanType, (state) => ({
    ...state,
    loading: false,
  })),
  on(deletePlanTypeSuccess, (state, { planTypes }) => ({
    ...state,
    loading: false,
    planTypes,
  })),
  on(deletePlanTypeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
