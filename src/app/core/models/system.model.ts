import { history } from './history.model';

export interface system {
  id: number;
  systemCode: string;
  systemName: string;
  status: boolean;
  isActive?: boolean;
  history?: history;
  createdby: number;
  createdDate: Date;
  lastChangedBy: number;
  lastChangedDate: Date;
  description?: string;
}
