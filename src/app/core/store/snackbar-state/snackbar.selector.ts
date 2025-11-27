import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SnackbarState } from './snackbar.state';

export const getSnackbarState =
  createFeatureSelector<SnackbarState>('snackbar');

export const getSnackbarMessage = createSelector(getSnackbarState, (state) => {
  return state;
});
