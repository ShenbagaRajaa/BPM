import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, from, catchError } from 'rxjs';
import {
  loadStateByCountry,
  loadStateByCountrySuccess,
  loadStateByCountryFailure,
  loadCountry,
  loadCountrySuccess,
  loadCountryFailure,
  loadCityByState,
  loadCityByStateFailure,
  loadCityByStateSuccess,
} from './country.action';
import { CountryService } from '../../services/country.service';
import { city } from '../../models/city.model';

@Injectable()
export class CountryEffects {
  private actions$ = inject(Actions);
  private service = inject(CountryService);

  loadStateByCountry$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadStateByCountry),
      mergeMap((action) =>
        this.service.getStateByCountry(action.countryName).pipe(
          mergeMap((states) => {
            const modifiedData = states.map(({ state }) => ({
              id: state,
              name: state,
            }));
            return from([loadStateByCountrySuccess({ states: modifiedData })]);
          }),
          catchError((error) =>
            from([loadStateByCountryFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  loadCityState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCityByState),
      mergeMap((action) =>
        this.service.getCityByState(action.stateName).pipe(
          mergeMap((city) => {
            const modifiedData = Object.values(
              city.reduce<Record<string, city>>((acc, { city, zipCode }) => {
                if (!acc[city]) {
                  acc[city] = { id: city, name: city, zipCode: [] };
                }
                acc[city].zipCode.push(zipCode);
                return acc;
              }, {})
            ) as city[];
            return from([loadCityByStateSuccess({ city: modifiedData })]);
          }),
          catchError((error) =>
            from([loadCityByStateFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  loadCountry$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCountry),
      mergeMap(() =>
        this.service.getCountry().pipe(
          mergeMap((country) => {
            return from([loadCountrySuccess({ country })]);
          }),
          catchError((error) =>
            from([loadCountryFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });
}
