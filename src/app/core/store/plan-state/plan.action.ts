import { createAction, props } from '@ngrx/store';
import { plan } from '../../models/plan.model';
import { planAdd } from '../../models/planAdd.model';

export const getAllPlan = createAction('[Plan] Load Plans');

export const getAllPlanSuccess = createAction(
  '[Plan] Load Plans Success',
  props<{ plans: plan[] }>()
);

export const getAllPlanFailure = createAction(
  '[Plan] Load Plans Failure',
  props<{ error: string }>()
);

export const getPlanById = createAction(
  '[Plan] Get Plan',
  props<{ id: number }>()
);

export const getPlanByIdSuccess = createAction(
  '[Plan] Get Plan Success',
  props<{ plan: plan }>()
);

export const getPlanByIdFailure = createAction(
  '[Plan] Get Plan Failure',
  props<{ error: string }>()
);

export const getPlanByStatus = createAction(
  '[Plan] Get Plan By Status',
  props<{ status: string }>()
);

export const getPlanByStatusSuccess = createAction(
  '[Plan] Get Plan By Status Success',
  props<{ plans: plan[] }>()
);

export const getPlanByStatusFailure = createAction(
  '[Plan] Get Plan By Status Failure',
  props<{ error: string }>()
);

export const addPlan = createAction(
  '[Plan] Add Plan',
  props<{ addPlan: planAdd }>()
);

export const addPlanSuccess = createAction(
  '[Plan] Add Plan Success',
  props<{ plans: plan[] }>()
);

export const addPlanFailure = createAction(
  '[Plan] Add Plan Failure',
  props<{ error: string }>()
);

export const editPlan = createAction(
  '[Plan] Edit Plan',
  props<{ editPlan: planAdd }>()
);

export const editPlanSuccess = createAction(
  '[Plan] Edit Plan Success',
  props<{ plans: plan[] }>()
);

export const editPlanFailure = createAction(
  '[Plan] Edit Plan Failure',
  props<{ error: string }>()
);

export const deletePlan = createAction(
  '[Plan] Delete Plan',
  props<{ planId: number }>()
);

export const deletePlanSuccess = createAction(
  '[Plan] Delete Plan Success',
  props<{ plans: plan[] }>()
);

export const deletePlanFailure = createAction(
  '[Plan] Delete Plan Failure',
  props<{ error: string }>()
);

export const updatePlanStatus = createAction(
  '[Plan] Update Plan Status',
  props<{ planId: number; status: string; successMessage: string }>()
);

export const updatePlanStatusSuccess = createAction(
  '[Plan] Update Plan Status Success',
  props<{ planId: number; status: string }>()
);

export const updatePlanStatusFailure = createAction(
  '[Plan] Update Plan Status Failure',
  props<{ error: string }>()
);
