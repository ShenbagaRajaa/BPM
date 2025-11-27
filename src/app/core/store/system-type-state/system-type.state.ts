import { systemType } from '../../models/systemType.model';

export interface SystemTypeState {
  systemTypes: systemType[];
  systemType: systemType;
  error: string;
  message: string;
}

export const initialState: SystemTypeState = {
  systemTypes: [],
  error: '',
  message: '',
  systemType: {
    id: 0,
    systemTypeName: '',
    status: true,
    createdBy: 0,
    lastChangedBy: 0,
    createdDate: new Date(),
    lastChangedDate: new Date(),
    isDeleted: false
  },
};
