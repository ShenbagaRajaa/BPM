import { createReducer, on } from '@ngrx/store';
import {
  addSite,
  addSiteFailure,
  addSiteSuccess,
  deleteSite,
  deleteSiteFailure,
  deleteSiteSuccess,
  editSite,
  editSiteFailure,
  editSiteSuccess,
  getSite,
  getSiteFailure,
  getSiteSuccess,
  getSites,
  getSitesFailure,
  getSitesSuccess,
} from './site.action';
import { initialState } from './site.state';

export const SiteReducer = createReducer(
  initialState,

  on(getSites, (state) => ({
    ...state,
    loading: false,
  })),
  on(getSitesSuccess, (state, { sites }) => ({
    ...state,
    loading: false,
    sites: sites,
  })),
  on(getSitesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(getSite, (state) => ({
    ...state,
    loading: false,
  })),
  on(getSiteSuccess, (state, { site }) => ({
    ...state,
    loading: false,
    site: site,
  })),
  on(getSiteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(addSite, (state) => ({
    ...state,
    loading: false,
  })),
  on(addSiteSuccess, (state, { sites }) => ({
    ...state,
    loading: false,
    sites,
  })),
  on(addSiteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(editSite, (state) => ({
    ...state,
    loading: false,
  })),
  on(editSiteSuccess, (state, { sites }) => ({
    ...state,
    loading: false,
    sites,
  })),
  on(editSiteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(deleteSite, (state) => ({
    ...state,
    loading: false,
  })),
  on(deleteSiteSuccess, (state, { sites }) => ({
    ...state,
    loading: false,
    sites,
  })),
  on(deleteSiteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
