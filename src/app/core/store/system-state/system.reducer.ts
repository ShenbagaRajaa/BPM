import { createReducer, on } from '@ngrx/store';
import {
  getSystems,
  getSystemsSuccess,
  getSystemsFailure,
  addSystem,
  addSystemFailure,
  addSystemSuccess,
  deleteSystem,
  deleteSystemFailure,
  deleteSystemSuccess,
  editSystem,
  editSystemFailure,
  editSystemSuccess,
  getSystem,
  getSystemFailure,
  getSystemSuccess,
} from './system.action';
import { initialState } from './system.state';

export const SystemReducer = createReducer(
  initialState,
  on(getSystems, (state) => ({
    ...state,
    loading: false,
  })),
  on(getSystemsSuccess, (state, { systems }) => ({
    ...state,
    loading: false,
    systems: systems,
  })),
  on(getSystemsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(getSystem, (state) => ({
    ...state,
    loading: false,
  })),
  on(getSystemSuccess, (state, { system }) => ({
    ...state,
    loading: false,
    system: system,
  })),
  on(getSystemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(addSystem, (state) => ({
    ...state,
    loading: false,
  })),
  on(addSystemSuccess, (state, { systems }) => ({
    ...state,
    loading: false,
    systems,
  })),
  on(addSystemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(editSystem, (state) => ({
    ...state,
    loading: false,
  })),
  on(editSystemSuccess, (state, { systems }) => ({
    ...state,
    loading: false,
    systems,
  })),
  on(editSystemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(deleteSystem, (state) => ({
    ...state,
    loading: false,
  })),
  on(deleteSystemSuccess, (state, { systems }) => ({
    ...state,
    loading: false,
    systems,
  })),
  on(deleteSystemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
