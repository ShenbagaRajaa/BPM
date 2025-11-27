import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SystemState } from './system.state';

export const SYSTEM_STATE_NAME = 'system';

const getSystemState = createFeatureSelector<SystemState>(SYSTEM_STATE_NAME);

export const selectAllSystems = createSelector(
  getSystemState,
  (state) => state.systems
);
export const selectSystem = createSelector(
  getSystemState,
  (state) => state.system
);
export const selectSystemError = createSelector(
  getSystemState,
  (state) => state.error
);
export const selectSystemMessage = createSelector(
  getSystemState,
  (state) => state.message
);
