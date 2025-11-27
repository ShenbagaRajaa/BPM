import { planType } from '../../models/planType.model';

export interface PlanTypeState {
  PlanTypes: planType[];
  PlanType: planType;
  error: string;
  message: string;
}

export const initialState: PlanTypeState = {
  PlanTypes: [],
  error: '',
  message: '',
  PlanType: {
    planTypeName: '',
    id: 0,
    status: false,
    createdBy: 0,
    createdDate: new Date(),
    lastChangedBy: 0,
    lastChangedDate: new Date(),
  },
};
