import { createReducer, on } from '@ngrx/store';
import {
  getConfigurations,
  getConfigurationsSuccess,
  getConfigurationsFailure,
  getConfiguration,
  getConfigurationSuccess,
  getConfigurationFailure,
  addConfiguration,
  addConfigurationSuccess,
  addConfigurationFailure,
  updateConfiguration,
  updateConfigurationSuccess,
  updateConfigurationFailure,
  deleteConfiguration,
  deleteConfigurationFailure,
  deleteConfigurationSuccess,
} from './configuration-settings.action';
import { initialState } from './configuration-settings.state';

export const configurationReducer = createReducer(
  initialState,
  on(getConfigurations, (state) => ({
    ...state,
    loading: true,
  })),
  on(getConfigurationsSuccess, (state, { configurations }) => ({
    ...state,
    loading: false,
    configurations,
  })),
  on(getConfigurationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(getConfiguration, (state) => ({
    ...state,
    loading: true,
  })),
  on(getConfigurationSuccess, (state, { configuration }) => ({
    ...state,
    loading: false,
    configuration,
  })),
  on(getConfigurationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(addConfiguration, (state) => ({
    ...state,
    loading: true,
  })),
  on(addConfigurationSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message,
  })),
  on(addConfigurationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(updateConfiguration, (state) => ({
    ...state,
    loading: true,
  })),
  on(updateConfigurationSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message,
  })),
  on(updateConfigurationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(deleteConfiguration, (state) => ({
    ...state,
    loading: true,
  })),
  on(deleteConfigurationSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message,
  })),
  on(deleteConfigurationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
