import { createAction, props } from '@ngrx/store';
import { system } from '../../models/system.model';

export const getSystems = createAction('[System] Get Systems');

export const getSystemsSuccess = createAction(
  '[System] Get Systems Success',
  props<{ systems: system[] }>()
);

export const getSystemsFailure = createAction(
  '[System] Get Systems Failure',
  props<{ error: string }>()
);

export const getSystem = createAction(
  '[System] Get System',
  props<{ systemId: number }>()
);

export const getSystemSuccess = createAction(
  '[System] Get System Success',
  props<{ system: system }>()
);

export const getSystemFailure = createAction(
  '[System] Get System Failure',
  props<{ error: string }>()
);

export const addSystem = createAction(
  '[System] Add System',
  props<{ addSystem: system }>()
);

export const addSystemSuccess = createAction(
  '[System] Add System Success',
  props<{ systems: system[] }>()
);

export const addSystemFailure = createAction(
  '[System] Add System Failure',
  props<{ error: string }>()
);

export const editSystem = createAction(
  '[System] Edit System',
  props<{ editSystem: system }>()
);

export const editSystemSuccess = createAction(
  '[System] Edit System Success',
  props<{ systems: system[] }>()
);

export const editSystemFailure = createAction(
  '[System] Edit System Failure',
  props<{ error: string }>()
);

export const deleteSystem = createAction(
  '[System] Delete System',
  props<{ systemId: number; userId: number }>()
);

export const deleteSystemSuccess = createAction(
  '[System] Delete System Success',
  props<{ systems: system[] }>()
);

export const deleteSystemFailure = createAction(
  '[System] Delete System Failure',
  props<{ error: string }>()
);
