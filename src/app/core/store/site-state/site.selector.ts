import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SiteState } from './site.state';

export const SITE_STATE_NAME = 'site';

const getSiteState = createFeatureSelector<SiteState>(SITE_STATE_NAME);

export const selectAllSites = createSelector(getSiteState, (state) => {
  return state.sites;
});

export const selectSite = createSelector(getSiteState, (state) => {
  return state.site;
});

export const selectSiteError = createSelector(getSiteState, (state) => {
  return state.error;
});

export const selectSiteMessage = createSelector(getSiteState, (state) => {
  return state.message;
});
