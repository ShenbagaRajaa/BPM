import { createReducer, on } from '@ngrx/store';
import {
  getSystemTypes,
  getSystemTypesSuccess,
  getSystemTypesFailure,
  addSystemType,
  addSystemTypeFailure,
  addSystemTypeSuccess,
  deleteSystemType,
  deleteSystemTypeFailure,
  deleteSystemTypeSuccess,
  editSystemType,
  editSystemTypeFailure,
  editSystemTypeSuccess,
  getSystemType,
  getSystemTypeFailure,
  getSystemTypeSuccess,
} from './system-type.action';
import { initialState } from './system-type.state';

export const SystemTypeReducer = createReducer(
  initialState,
  on(getSystemTypes, (state) => ({
    ...state,
    loading: false,
  })),
  on(getSystemTypesSuccess, (state, { systemTypes }) => ({
    ...state,
    loading: false,
    systemTypes: systemTypes,
  })),
  on(getSystemTypesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(getSystemType, (state) => ({
    ...state,
    loading: false,
  })),
  on(getSystemTypeSuccess, (state, { systemType }) => ({
    ...state,
    loading: false,
    systemType: systemType,
  })),
  on(getSystemTypeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(addSystemType, (state) => ({
    ...state,
    loading: false,
  })),
  on(addSystemTypeSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message,
  })),
  on(addSystemTypeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(editSystemType, (state) => ({
    ...state,
    loading: false,
  })),
  on(editSystemTypeSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message,
  })),
  on(editSystemTypeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(deleteSystemType, (state) => ({
    ...state,
    loading: false,
  })),
  on(deleteSystemTypeSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message,
  })),
  on(deleteSystemTypeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
