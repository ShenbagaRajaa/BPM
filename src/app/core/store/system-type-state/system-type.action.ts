import { createAction, props } from '@ngrx/store';
import { systemType } from '../../models/systemType.model';

export const getSystemTypes = createAction('[SystemType] Get SystemTypes');

export const getSystemTypesSuccess = createAction(
  '[SystemType] Get SystemTypes Success',
  props<{ systemTypes: systemType[] }>()
);

export const getSystemTypesFailure = createAction(
  '[SystemType] Get SystemTypes Failure',
  props<{ error: string }>()
);

export const getSystemType = createAction(
  '[SystemType] Get SystemType',
  props<{ systemTypeId : number}>()
);

export const getSystemTypeSuccess = createAction(
  '[SystemType] Get SystemType Success',
  props<{ systemType : systemType }>()
);

export const getSystemTypeFailure = createAction(
  '[SystemType] Get SystemType Failure',
  props<{ error: string }>()
);

export const addSystemType = createAction(
  '[SystemType] Add SystemType',
  props<{ addSystemType : systemType }>()
);

export const addSystemTypeSuccess = createAction(
  '[SystemType] Add SystemType Success',
  props<{ message : string }>()
);

export const addSystemTypeFailure = createAction(
  '[SystemType] Add SystemType Failure',
  props<{ error: string }>()
);

export const editSystemType = createAction(
  '[SystemType] Edit SystemType',
  props<{ editSystemType : systemType }>()
);

export const editSystemTypeSuccess = createAction(
  '[SystemType] Edit SystemType Success',
  props<{ message : string }>()
);

export const editSystemTypeFailure = createAction(
  '[SystemType] Edit SystemType Failure',
  props<{ error: string }>()
);

export const deleteSystemType = createAction(
  '[SystemType] Delete SystemType',
  props<{ systemTypeId : number, userId : number}>()
);

export const deleteSystemTypeSuccess = createAction(
  '[SystemType] Delete SystemType Success',
  props<{ message : string }>()
);

export const deleteSystemTypeFailure = createAction(
  '[SystemType] Delete SystemType Failure',
  props<{ error: string }>()
);