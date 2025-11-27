import { history } from "./history.model";

export interface role {
  id: number;
  roleName: string;
  createdBy: number;
  lastChangedBy : number;
  status : boolean
  history?: history;
    createdDate?: string;
    lastChangedDate?: string;
}
