import { site } from '../../models/site.model';

export interface SiteState {
  sites: site[];
  error: string;
  site: site;
  message: string;
}

export const initialState: SiteState = {
  sites: [],
  message: '',
  error: '',
  site: {
    id: 0,
    siteName: '',
    siteCode: '',
    address: '',
    city: '',
    country: '',
    createdBy: 0,
    createdDate: new Date(),
    lastChangedBy: 0,
    lastChangedDate: new Date(),
    state: '',
    status: false,
    zipCode: 0,
    history: {
      createdBy: 0,
      createdDate: new Date(),
      lastChangedBy: 0,
      lastChangedDate: new Date(),
    },
  },
};
