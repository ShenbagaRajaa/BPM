import { createReducer, on } from '@ngrx/store';
import {
  loadCityByState,
  loadCityByStateSuccess,
  loadCityByStateFailure,
  loadCountry,
  loadCountryFailure,
  loadCountrySuccess,
  loadDefaultConfig,
  loadStateByCountry,
  loadStateByCountryFailure,
  loadStateByCountrySuccess,
} from './country.action';
import { initialState } from './country.state';

export const CountryReducer = createReducer(
  initialState,

  on(loadCountry, (state) => ({
    ...state,
    loading: false,
  })),
  on(loadCountrySuccess, (state, { country }) => ({
    ...state,
    loading: false,
    country: country,
  })),
  on(loadCountryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(loadStateByCountry, (state) => ({
    ...state,
    loading: false,
  })),
  on(loadStateByCountrySuccess, (state, { states }) => ({
    ...state,
    loading: false,
    state: states,
  })),
  on(loadStateByCountryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(loadCityByState, (state) => ({
    ...state,
    loading: false,
  })),
  on(loadCityByStateSuccess, (state, { city }) => ({
    ...state,
    loading: false,
    city: city.map(({ id, name, zipCode }) => ({
      id,
      name,
      zipCode,
    })),
  })),
  on(loadCityByStateFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(loadDefaultConfig, (state) => ({
    ...state,
    loading: false,
  }))
);
