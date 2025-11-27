import { history } from "./history.model";

export interface department {
  id: number;
  departmentCode: string;
  departmentName: string;
  status: boolean;
  history?: history;
  createdBy?: number;
  createdDate?: string;
  lastChangedBy: number;
  lastChangedDate: string;
  description?: string;

}
