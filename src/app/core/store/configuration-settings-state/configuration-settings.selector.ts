import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConfigurationState } from './configuration-settings.state';

export const CONFIGURATION_STATE_NAME = 'configuration';

const getConfigurationState = createFeatureSelector<ConfigurationState>(
  CONFIGURATION_STATE_NAME
);

export const selectAllConfigurations = createSelector(
  getConfigurationState,
  (state) => state.configurations
);

export const selectConfiguration = createSelector(
  getConfigurationState,
  (state) => state.configuration
);

export const selectConfigurationError = createSelector(
  getConfigurationState,
  (state) => state.error
);

export const selectConfigurationMessage = createSelector(
  getConfigurationState,
  (state) => state.message
);
