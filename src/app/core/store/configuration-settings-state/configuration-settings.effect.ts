import { inject, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { ConfigurationSettingsService } from '../../services/configuration-settings.service';
import {
  getConfigurations,
  getConfigurationsSuccess,
  getConfigurationsFailure,
  getConfiguration,
  getConfigurationSuccess,
  getConfigurationFailure,
  addConfiguration,
  addConfigurationSuccess,
  addConfigurationFailure,
  updateConfiguration,
  updateConfigurationSuccess,
  updateConfigurationFailure,
  deleteConfiguration,
  deleteConfigurationFailure,
  deleteConfigurationSuccess,
} from './configuration-settings.action';
import { catchError, from, map, mergeMap } from 'rxjs';
import { Router } from '@angular/router';
import { showSnackBar } from '../snackbar-state/snackbar.action';

@Injectable()
export class ConfigurationEffects {
  private actions$ = inject(Actions);
  private configurationService = inject(ConfigurationSettingsService);
  private router = inject(Router);

  getConfigurations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getConfigurations),
      mergeMap(() =>
        this.configurationService.getAllConfigurations().pipe(
          map((configurations) => getConfigurationsSuccess({ configurations })),
          catchError((error) =>
            from([getConfigurationsFailure({ error: error?.error?.detail })])
          )
        )
      )
    )
  );

  getConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getConfiguration),
      mergeMap((action) =>
        this.configurationService.getConfiguration(action.id).pipe(
          map((configuration) => getConfigurationSuccess({ configuration })),
          catchError((error) =>
            from([getConfigurationFailure({ error: error?.error?.detail })])
          )
        )
      )
    )
  );

  addConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addConfiguration),
      mergeMap((action) =>
        this.configurationService.addConfiguration(action.newConfig).pipe(
          mergeMap((message) => {
            this.router.navigate(['/home/defaultConfigurations/']);
            return from([
              addConfigurationSuccess({ message }),
              showSnackBar({
                message: 'New setting added successfully.',
                status: 'success',
              }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addConfigurationFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              addConfigurationFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    )
  );

  updateConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateConfiguration),
      mergeMap((action) =>
        this.configurationService
          .updateConfiguration(action.updatedConfig)
          .pipe(
            mergeMap((message) => {
              this.router.navigate(['/home/defaultConfigurations/']);
              return from([
                updateConfigurationSuccess({ message }),
                showSnackBar({
                  message: 'Setting updated successfully',
                  status: 'success',
                }),
              ]);
            }),
            catchError((error) => {
              if (error?.error?.detail !== 'Authorization Failed.') {
                return from([
                  updateConfigurationFailure({ error: error?.error?.detail }),
                  showSnackBar({
                    message: error?.error?.detail,
                    status: 'error',
                  }),
                ]);
              }
              return from([
                updateConfigurationFailure({ error: error?.error?.detail }),
              ]);
            })
          )
      )
    )
  );

  deleteConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteConfiguration),
      mergeMap((action) =>
        this.configurationService
          .deleteConfiguration(action.settingId, action.userId)
          .pipe(
            mergeMap((message) => {
              return from([
                deleteConfigurationSuccess({ message }),
                showSnackBar({
                  message: 'Setting deleted successfully.',
                  status: 'success',
                }),
              ]);
            }),
            catchError((error) => {
              if (error?.error?.detail !== 'Authorization Failed.') {
                return from([
                  deleteConfigurationFailure({ error: error?.error?.detail }),
                  showSnackBar({
                    message: error?.error?.detail,
                    status: 'error',
                  }),
                ]);
              }
              return from([
                deleteConfigurationFailure({ error: error?.error?.detail }),
              ]);
            })
          )
      )
    )
  );
}
