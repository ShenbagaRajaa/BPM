import { system } from '../../models/system.model';

export interface SystemState {
  systems: system[];
  system: system;
  error: string;
  message: string;
}

export const initialState: SystemState = {
  systems: [],
  error: '',
  message: '',
  system: {
    id: 0,
    systemCode: '',
    systemName: '',
    status: true,
    createdby: 0,
    createdDate: new Date(),
    lastChangedBy: 0,
    lastChangedDate: new Date(),
  },
};
