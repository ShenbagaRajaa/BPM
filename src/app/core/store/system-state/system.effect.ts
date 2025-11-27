import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, mergeMap, tap } from 'rxjs/operators';
import { showSnackBar } from '../snackbar-state/snackbar.action';
import {
  addSystem,
  addSystemFailure,
  addSystemSuccess,
  deleteSystem,
  deleteSystemFailure,
  deleteSystemSuccess,
  editSystem,
  editSystemFailure,
  editSystemSuccess,
  getSystem,
  getSystemFailure,
  getSystems,
  getSystemsFailure,
  getSystemsSuccess,
  getSystemSuccess,
} from './system.action';
import { SystemService } from '../../services/system.service';
import { Router } from '@angular/router';

@Injectable()
export class SystemsEffects {
  private actions$ = inject(Actions);
  private service = inject(SystemService);
  private router = inject(Router);

  getSystems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getSystems),
      exhaustMap(() =>
        this.service.getSystems().pipe(
          mergeMap((System) => from([getSystemsSuccess({ systems: System })])),
          catchError((error) =>
            from([getSystemsFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getSystem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getSystem),
      exhaustMap((action) =>
        this.service.getSystem(action.systemId).pipe(
          mergeMap((system) => from([getSystemSuccess({ system })])),
          catchError((error) => {
            return from([getSystemFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  addSystem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addSystem),
      mergeMap((action) =>
        this.service.addSystem(action.addSystem).pipe(
          mergeMap((systems) => {
            return from([
              showSnackBar({
                message: 'System added successfully',
                status: 'success',
              }),
              addSystemSuccess({ systems }),
            ]);
          }),
          tap(() => {
            this.router.navigate([`../home/systemManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addSystemFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([addSystemFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  editSystem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editSystem),
      mergeMap((action) =>
        this.service.editSystem(action.editSystem).pipe(
          mergeMap((systems) => {
            return from([
              showSnackBar({
                message: 'System updated successfully',
                status: 'success',
              }),
              editSystemSuccess({ systems }),
            ]);
          }),
          tap(() => {
            this.router.navigate([`../home/systemManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                editSystemFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([editSystemFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  deleteSystem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteSystem),

      mergeMap((action) =>
        this.service.deleteSystem(action.systemId, action.userId).pipe(
          mergeMap((systems) => {
            return from([
              showSnackBar({
                message: 'System Deleted Successfully',
                status: 'success',
              }),
              deleteSystemSuccess({ systems }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                deleteSystemFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([deleteSystemFailure({ error: error?.error?.detail })]);
          })
        )
      )
    )
  );
}
