

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SystemTypeState } from './system-type.state';

export const SYSTEM_TYPE_STATE_NAME = 'systemType';

const getSystemState = createFeatureSelector<SystemTypeState>(SYSTEM_TYPE_STATE_NAME);

export const selectAllSystemTypes = createSelector(getSystemState, (state) => state.systemTypes);
export const selectSystemType = createSelector(getSystemState, (state) => state.systemType);
export const selectSystemTypeError = createSelector(getSystemState, (state) => state.error);
export const selectSystemTypeMessage = createSelector(getSystemState, (state) => state.message);
