import { history } from "./history.model";

export interface planType {
  planTypeName: string;
  id:number;
  status: boolean;
  history?: history;
  createdBy: number,
  createdDate: Date,
  lastChangedBy: number,
  lastChangedDate: Date,
  description?: string;

}
