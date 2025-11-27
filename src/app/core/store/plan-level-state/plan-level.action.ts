import { createAction, props } from '@ngrx/store';
import { planLevel } from '../../models/planLevel.model';

export const getPlanLevels = createAction('[PlanLevel] Get PlanLevels');

export const getPlanLevelsSuccess = createAction(
  '[PlanLevel] Get PlanLevels Success',
  props<{ planLevels: planLevel[] }>()
);

export const getPlanLevelsFailure = createAction(
  '[PlanLevel] Get PlanLevels Failure',
  props<{ error: string }>()
);

export const getPlanLevel = createAction(
  '[PlanLevel] Get PlanLevel',
  props<{ planLevelId: number }>()
);

export const getPlanLevelSuccess = createAction(
  '[PlanLevel] Get PlanLevel Success',
  props<{ planLevel: planLevel }>()
);

export const getPlanLevelFailure = createAction(
  '[PlanLevel] Get PlanLevel Failure',
  props<{ error: string }>()
);

export const addPlanLevel = createAction(
  '[PlanLevel] Add PlanLevel',
  props<{ addPlanLevel: planLevel }>()
);

export const addPlanLevelSuccess = createAction(
  '[PlanLevel] Add PlanLevel Success',
  props<{ planLevels: planLevel[] }>()
);

export const addPlanLevelFailure = createAction(
  '[PlanLevel] Add PlanLevel Failure',
  props<{ error: string }>()
);

export const editPlanLevel = createAction(
  '[PlanLevel] Edit PlanLevel',
  props<{ editPlanLevel: planLevel }>()
);

export const editPlanLevelSuccess = createAction(
  '[PlanLevel] Edit PlanLevel Success',
  props<{ planLevels: planLevel[] }>()
);

export const editPlanLevelFailure = createAction(
  '[PlanLevel] Edit PlanLevel Failure',
  props<{ error: string }>()
);

export const deletePlanLevel = createAction(
  '[PlanLevel] Delete PlanLevel',
  props<{ planLevelId: number; userId: number }>()
);

export const deletePlanLevelSuccess = createAction(
  '[PlanLevel] Delete PlanLevel Success',
  props<{ planLevels: planLevel[] }>()
);

export const deletePlanLevelFailure = createAction(
  '[PlanLevel] Delete PlanLevel Failure',
  props<{ error: string }>()
);
