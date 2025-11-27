import { createAction, props } from '@ngrx/store';

export const showSnackBar = createAction(
  '[snackbar state] set show snackbar',
  props<{
    message: string;
    actionLabel?: string;
    duration?: number;
    status?: 'success' | 'error' | 'info';
  }>()
);

export const hideSnackBar = createAction('[snackbar state] set hide snackbar');
