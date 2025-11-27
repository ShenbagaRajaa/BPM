import { createAction, props } from '@ngrx/store';
import { site } from '../../models/site.model';

export const getSites = createAction('[Site] Get Sites');

export const getSitesSuccess = createAction(
  '[Site] Get Sites Success',
  props<{ sites: site[] }>()
);

export const getSitesFailure = createAction(
  '[Site] Get Sites Failure',
  props<{ error: string }>()
);

export const getSite = createAction(
  '[Site] Get Site',
  props<{ siteId: number }>()
);

export const getSiteSuccess = createAction(
  '[Site] Get Site Success',
  props<{ site: site }>()
);

export const getSiteFailure = createAction(
  '[Site] Get Site Failure',
  props<{ error: string }>()
);

export const addSite = createAction(
  '[Site] Add Site',
  props<{ addSite: site; modelId?: number }>()
);

export const addSiteSuccess = createAction(
  '[Site] Add Site Success',
  props<{ sites: site[] }>()
);

export const addSiteFailure = createAction(
  '[Site] Add Site Failure',
  props<{ error: string }>()
);

export const editSite = createAction(
  '[Site] Edit Site',
  props<{ editSite: site }>()
);

export const editSiteSuccess = createAction(
  '[Site] Edit Site Success',
  props<{ sites: site[] }>()
);

export const editSiteFailure = createAction(
  '[Site] Edit Site Failure',
  props<{ error: string }>()
);

export const deleteSite = createAction(
  '[Site] Delete Site',
  props<{ siteId: number; userId: number }>()
);

export const deleteSiteSuccess = createAction(
  '[Site] Delete Site Success',
  props<{ sites: site[] }>()
);

export const deleteSiteFailure = createAction(
  '[Site] Delete Site Failure',
  props<{ error: string }>()
);
