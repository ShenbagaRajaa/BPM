import { Sequence } from './Sequence.model';

export interface planDisplay {
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
  completedSequences: number;
  incompletedSequences: number;
  createdDate?: Date;
  lastChangedDate?: Date;
}
