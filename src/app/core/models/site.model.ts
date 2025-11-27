import { history } from "./history.model";

export interface site {
  id: number;
  siteName: string;
  siteCode: string;
  address: string;
  city: string;
  country: string;
  createdBy: number;
  createdDate: Date;
  lastChangedBy: number;
  lastChangedDate: Date;
  state: string;
  status: boolean;
  zipCode: number;
  history? : history;
  description?: string;

}
