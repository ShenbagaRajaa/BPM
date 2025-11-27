import { createReducer, on } from '@ngrx/store';
import { showSnackBar, hideSnackBar } from './snackbar.action';
import { initialState } from './snackbar.state';

export const snackbarReducer = createReducer(
  initialState,
  on(showSnackBar, (state, { message, actionLabel, duration, status }) => ({
    ...state,
    message,
    actionLabel: actionLabel || 'Close',
    duration: duration || 5000,
    status: status || 'info',
    show: true,
  })),
  on(hideSnackBar, (state) => ({ ...state, show: false }))
);
