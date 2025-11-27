import { city } from '../../models/city.model';
import { country } from '../../models/country.model';
import { state } from '../../models/state.model';

export interface CountryState {
  country: country[];
  state: state[];
  city: city[];
}

export const initialState: CountryState = {
  country: [],
  state: [],
  city: [],
};
