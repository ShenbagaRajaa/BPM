import { history } from './history.model';

export interface drTeam {
  id: number;
  createdBy: number;
  teamName: string;
  status: boolean;
  lastChangedBy: number;
  history?: history;
  createdDate?: string;
  lastChangedDate?: string;
  description?: string;
}
