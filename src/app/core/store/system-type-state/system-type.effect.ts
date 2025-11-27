import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, mergeMap, tap } from 'rxjs/operators';
import { showSnackBar } from '../snackbar-state/snackbar.action';
import {
  addSystemType,
  addSystemTypeFailure,
  addSystemTypeSuccess,
  deleteSystemType,
  deleteSystemTypeFailure,
  deleteSystemTypeSuccess,
  editSystemType,
  editSystemTypeFailure,
  editSystemTypeSuccess,
  getSystemType,
  getSystemTypeFailure,
  getSystemTypes,
  getSystemTypesFailure,
  getSystemTypesSuccess,
  getSystemTypeSuccess,
} from './system-type.action';
import { Router } from '@angular/router';
import { SystemTypeService } from '../../services/system-type.service';

@Injectable()
export class SystemTypeEffects {
  // constructor(
  //   private actions$: Actions,
  //   private service: SystemTypeService,
  //   private router: Router
  // ) {}
   private actions$ = inject(Actions);
        private service = inject(SystemTypeService);
        private router = inject(Router);

  getSystemTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getSystemTypes),
      exhaustMap(() =>
        this.service.getSystemTypes().pipe(
          mergeMap((SystemTypes) =>
            from([getSystemTypesSuccess({ systemTypes: SystemTypes })])
          ),
          catchError((error) =>
            from([getSystemTypesFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getSystemType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getSystemType),
      exhaustMap((action) =>
        this.service.getSystemType(action.systemTypeId).pipe(
          mergeMap((systemType) =>
            from([getSystemTypeSuccess({ systemType })])
          ),
          catchError((error) => {
            return from([
              getSystemTypeFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    );
  });

  addSystemType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addSystemType),
      mergeMap((action) =>
        this.service.addSystemType(action.addSystemType).pipe(
          mergeMap((message) => {
            return from([
              showSnackBar({
                message: 'System Type added successfully',
                status: 'success',
              }),
              addSystemTypeSuccess({ message }),
            ]);
          }),
          tap(() => {
            this.router.navigate([`../home/systemTypeManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addSystemTypeFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              addSystemTypeFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    );
  });

  editSystemType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editSystemType),
      mergeMap((action) =>
        this.service.editSystemType(action.editSystemType).pipe(
          mergeMap((message) => {
            return from([
              showSnackBar({
                message: 'System Type updated successfully',
                status: 'success',
              }),
              editSystemTypeSuccess({ message }),
            ]);
          }),
          tap(() => {
            this.router.navigate([`../home/systemTypeManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                editSystemTypeFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              editSystemTypeFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    );
  });

  deleteSystemType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteSystemType),

      mergeMap((action) =>
        this.service.deleteSystemType(action.systemTypeId, action.userId).pipe(
          mergeMap((message) => {
            return from([
              showSnackBar({
                message: 'SystemType Deleted Successfully',
                status: 'success',
              }),
              deleteSystemTypeSuccess({ message }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                deleteSystemTypeFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              deleteSystemTypeFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    )
  );
}
