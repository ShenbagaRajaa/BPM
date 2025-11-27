import { planLevel } from '../../models/planLevel.model';

export interface PlanLevelState {
  PlanLevels: planLevel[];
  PlanLevel: planLevel;
  error: string;
  message: string;
}

export const initialState: PlanLevelState = {
  PlanLevels: [],
  error: '',
  message: '',
  PlanLevel: {
    planLevelName: '',
    id: 0,
    status: false,
    createdBy: 0,
    createdDate: new Date(),
    lastChangedBy: 0,
    lastChangedDate: new Date(),
  },
};
