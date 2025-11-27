import {
  addPlan,
  addPlanFailure,
  addPlanSuccess,
  deletePlan,
  deletePlanFailure,
  deletePlanSuccess,
  editPlan,
  editPlanFailure,
  editPlanSuccess,
  getAllPlan,
  getAllPlanFailure,
  getAllPlanSuccess,
  getPlanById,
  getPlanByIdFailure,
  getPlanByIdSuccess,
  getPlanByStatus,
  getPlanByStatusFailure,
  getPlanByStatusSuccess,
  updatePlanStatus,
  updatePlanStatusFailure,
  updatePlanStatusSuccess,
} from './plan.action';
import { createReducer, on } from '@ngrx/store';
import { initialState } from './plan.state';

export const PlanReducer = createReducer(
  initialState,

  on(getAllPlan, (state) => ({
    ...state,
    loading: true,
    snackbarstate: { loader: true },
  })),
  on(getAllPlanSuccess, (state, { plans }) => ({
    ...state,
    loading: false,
    plans,
  })),
  on(getAllPlanFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(getPlanById, (state) => ({
    ...state,
    loading: false,
  })),
  on(getPlanByIdSuccess, (state, { plan }) => ({
    ...state,
    loading: false,
    plan: plan,
  })),
  on(getPlanByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(getPlanByStatus, (state) => ({
    ...state,
    loading: false,
  })),
  on(getPlanByStatusSuccess, (state, { plans }) => ({
    ...state,
    loading: false,
    plansByStatus: plans.map(
      ({ id, planIdentifier, planName, planStatus }) => ({
        id,
        planIdentifier,
        planName,
        planStatus,
      })
    ),
  })),
  on(getPlanByStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(addPlan, (state) => ({
    ...state,
    loading: false,
  })),
  on(addPlanSuccess, (state, { plans }) => ({
    ...state,
    loading: false,
    plans,
  })),
  on(addPlanFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(editPlan, (state) => ({
    ...state,
    loading: false,
  })),
  on(editPlanSuccess, (state, { plans }) => ({
    ...state,
    loading: false,
    plans,
  })),
  on(editPlanFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(deletePlan, (state) => ({
    ...state,
    loading: false,
  })),
  on(deletePlanSuccess, (state, { plans }) => ({
    ...state,
    loading: false,
    plans,
  })),
  on(deletePlanFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(updatePlanStatus, (state) => ({
    ...state,
    loading: true,
  })),
  on(updatePlanStatusSuccess, (state, { planId, status }) => ({
    ...state,
    loading: false,
    plans: state.plans.map((plan) =>
      plan.id === planId ? { ...plan, planStatus: status } : plan
    ),
  })),
  on(updatePlanStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
