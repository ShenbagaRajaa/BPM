import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CountryState } from './country.state';
export const COUNTRY_STATE_NAME = 'country';

const getCountryState = createFeatureSelector<CountryState>(COUNTRY_STATE_NAME);

export const getCountry = createSelector(getCountryState, (state) => {
  return state.country;
});

export const getStateByCountry = createSelector(getCountryState, (state) => {
  return state.state;
});

export const getCityByState = createSelector(getCountryState, (state) => {
  return state.city;
});
