import { Sequence } from './Sequence.model';

export interface plan {
  status: any;
  id: number;
  planIdentifier: string;
  planStatus: string;
  sequences: Sequence[];
  planName: string;
  planTypeId: string;
  planLevelId: string;
  systemId: string;
  departmentId: string;
  siteId: string;
  customerCode: string;
  planDescription: string;
  createdDate?: Date;
  lastChangedDate?: Date;
}

