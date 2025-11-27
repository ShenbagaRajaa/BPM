import { createAction, props } from '@ngrx/store';
import { ConfigurationSetting } from '../../models/defaultConfig.model';

export const getConfigurations = createAction(
  '[Configuration] Get Configurations'
);
export const getConfigurationsSuccess = createAction(
  '[Configuration] Get Configurations Success',
  props<{ configurations: ConfigurationSetting[] }>()
);
export const getConfigurationsFailure = createAction(
  '[Configuration] Get Configurations Failure',
  props<{ error: string }>()
);

export const getConfiguration = createAction(
  '[Configuration] Get Configuration',
  props<{ id: number }>()
);
export const getConfigurationSuccess = createAction(
  '[Configuration] Get Configuration Success',
  props<{ configuration: ConfigurationSetting }>()
);
export const getConfigurationFailure = createAction(
  '[Configuration] Get Configuration Failure',
  props<{ error: string }>()
);

export const addConfiguration = createAction(
  '[Configuration] Add Configuration',
  props<{ newConfig: ConfigurationSetting }>()
);
export const addConfigurationSuccess = createAction(
  '[Configuration] Add Configuration Success',
  props<{ message: string }>()
);
export const addConfigurationFailure = createAction(
  '[Configuration] Add Configuration Failure',
  props<{ error: string }>()
);

export const updateConfiguration = createAction(
  '[Configuration] Update Configuration',
  props<{ updatedConfig: ConfigurationSetting }>()
);
export const updateConfigurationSuccess = createAction(
  '[Configuration] Update Configuration Success',
  props<{ message: string }>()
);
export const updateConfigurationFailure = createAction(
  '[Configuration] Update Configuration Failure',
  props<{ error: string }>()
);

export const deleteConfiguration = createAction(
  '[Configuration] Delete Configuration',
  props<{ settingId: number; userId: number }>()
);

export const deleteConfigurationSuccess = createAction(
  '[Configuration] Delete Configuration Success',
  props<{ message: string }>()
);

export const deleteConfigurationFailure = createAction(
  '[Configuration] Delete Configuration Failure',
  props<{ error: string }>()
);
