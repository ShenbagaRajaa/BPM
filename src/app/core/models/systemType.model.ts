import { history } from "./history.model";

export interface systemType {
  id : number;
  systemTypeName: string;
  status: boolean;
  createdBy: number,
  lastChangedBy: number,
  createdDate:  Date,
  lastChangedDate: Date,
  isDeleted: boolean
  history?: history;
  description?: string;
}
