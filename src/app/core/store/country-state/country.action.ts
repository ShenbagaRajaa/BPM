import { createAction, props } from '@ngrx/store';
import { country } from '../../models/country.model';
import { city } from '../../models/city.model';
import { state } from '../../models/state.model';

export const loadCountry = createAction('[common] load Country');

export const loadCountrySuccess = createAction(
  '[common] load Country Success',
  props<{ country: country[] }>()
);

export const loadCountryFailure = createAction(
  '[common] load Country Failure',
  props<{ error: string }>()
);

export const loadStateByCountry = createAction(
  '[common] load State By Country',
  props<{
    countryName: string;
  }>()
);

export const loadStateByCountrySuccess = createAction(
  '[common] load State By Country Success',
  props<{ states: state[] }>()
);

export const loadStateByCountryFailure = createAction(
  '[common] load State By Country Failure',
  props<{ error: string }>()
);

export const loadCityByState = createAction(
  '[common] load city By state',
  props<{
    stateName: string;
  }>()
);

export const loadCityByStateSuccess = createAction(
  '[common] load city By state Success',
  props<{ city: city[] }>()
);

export const loadCityByStateFailure = createAction(
  '[common] load city By state Failure',
  props<{ error: string }>()
);

export const loadDefaultConfig = createAction(
  '[common state] load default config'
);
