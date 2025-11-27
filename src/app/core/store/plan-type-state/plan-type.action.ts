import { createAction, props } from '@ngrx/store';
import { planType } from '../../models/planType.model';

export const getPlanTypes = createAction('[PlanType] Get PlanTypes');

export const getPlanTypesSuccess = createAction(
  '[PlanType] Get PlanTypes Success',
  props<{ planTypes: planType[] }>()
);

export const getPlanTypesFailure = createAction(
  '[PlanType] Get PlanTypes Failure',
  props<{ error: string }>()
);

export const getPlanType = createAction(
  '[PlanType] Get PlanType',
  props<{ planTypeId: number }>()
);

export const getPlanTypeSuccess = createAction(
  '[PlanType] Get PlanType Success',
  props<{ planType: planType }>()
);

export const getPlanTypeFailure = createAction(
  '[PlanType] Get PlanType Failure',
  props<{ error: string }>()
);

export const addPlanType = createAction(
  '[PlanType] Add PlanType',
  props<{ addPlanType: planType }>()
);

export const addPlanTypeSuccess = createAction(
  '[PlanType] Add PlanType Success',
  props<{ planTypes: planType[] }>()
);

export const addPlanTypeFailure = createAction(
  '[PlanType] Add PlanType Failure',
  props<{ error: string }>()
);

export const editPlanType = createAction(
  '[PlanType] Edit PlanType',
  props<{ editPlanType: planType }>()
);

export const editPlanTypeSuccess = createAction(
  '[PlanType] Edit PlanType Success',
  props<{ planTypes: planType[] }>()
);

export const editPlanTypeFailure = createAction(
  '[PlanType] Edit PlanType Failure',
  props<{ error: string }>()
);

export const deletePlanType = createAction(
  '[PlanType] Delete PlanType',
  props<{ planTypeId: number; userId: number }>()
);

export const deletePlanTypeSuccess = createAction(
  '[PlanType] Delete PlanType Success',
  props<{ planTypes: planType[] }>()
);

export const deletePlanTypeFailure = createAction(
  '[PlanType] Delete PlanType Failure',
  props<{ error: string }>()
);
