import { ConfigurationSetting } from '../../models/defaultConfig.model';

export interface ConfigurationState {
  configurations: ConfigurationSetting[];
  configuration: ConfigurationSetting;
  error: string;
  message: string;
}

export const initialState: ConfigurationState = {
  configurations: [],
  configuration: {
    id: 0,
    name: '',
    value: '',
    description: '',
    createdBy: 0,
    createdDate: new Date(),
    lastChangedBy: 0,
    lastChangedDate: new Date(),
  },
  error: '',
  message: '',
};
