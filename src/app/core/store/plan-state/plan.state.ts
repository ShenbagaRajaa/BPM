import { plan } from '../../models/plan.model';

export interface PlanState {
  plans: plan[];
  error: string;
  message: string;
  plan: plan;
  plansByStatus: {
    id: number;
    planIdentifier: string;
    planName: string;
    planStatus: string;
  }[];
}

export const initialState: PlanState = {
  plans: [],
  plansByStatus: [],
  message: '',
  plan: {
    id: 0,
    planIdentifier: '',
    planStatus: '',
    sequences: [],
    planName: '',
    planTypeId: '',
    planLevelId: '',
    systemId: '',
    departmentId: '',
    siteId: '',
    customerCode: '',
    planDescription: '',
    status: undefined,
  },
  error: '',
};
