import { history } from "./history.model";

export interface planLevel {
  planLevelName: string;
  id:number;
  status: boolean;
  history?: history;
  createdBy: number,
  createdDate: Date,
  lastChangedBy: number,
  lastChangedDate: Date,
  description?: string;
}


