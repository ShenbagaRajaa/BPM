import { Sequence } from './Sequence.model';

export interface planAdd {
  id: number;
  planName: string;
  planTypeId: string;
  planLevelId: string;
  systemId: string;
  departmentId: string;
  siteId: string;
  customerCode: string;
  planDescription: string;
  planIdentifier: string;
  planStatus: string;
  sequences: Sequence[];
  createdDate?: Date;
  lastChangedDate?: Date;
}
