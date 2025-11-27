import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, mergeMap, tap } from 'rxjs/operators';
import { showSnackBar } from '../snackbar-state/snackbar.action';
import {
  addPlanLevel,
  addPlanLevelFailure,
  addPlanLevelSuccess,
  deletePlanLevel,
  deletePlanLevelFailure,
  deletePlanLevelSuccess,
  editPlanLevel,
  editPlanLevelFailure,
  editPlanLevelSuccess,
  getPlanLevel,
  getPlanLevelFailure,
  getPlanLevels,
  getPlanLevelsFailure,
  getPlanLevelsSuccess,
  getPlanLevelSuccess,
} from './plan-level.action';
import { PlanLevelService } from '../../services/plan-level.service';
import { Router } from '@angular/router';

@Injectable()
export class PlanLevelsEffects {
  private actions$ = inject(Actions);
  private service = inject(PlanLevelService);
  private router = inject(Router);

  getPlanLevels$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getPlanLevels),
      exhaustMap(() =>
        this.service.getPlanLevels().pipe(
          mergeMap((PlanLevel) =>
            from([getPlanLevelsSuccess({ planLevels: PlanLevel })])
          ),
          catchError((error) =>
            from([getPlanLevelsFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getPlanLevel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getPlanLevel),
      exhaustMap((action) =>
        this.service.getPlanLevel(action.planLevelId).pipe(
          mergeMap((planLevel) => from([getPlanLevelSuccess({ planLevel })])),
          catchError((error) => {
            return from([getPlanLevelFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  addPlanLevel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addPlanLevel),
      mergeMap((action) =>
        this.service.addPlanLevel(action.addPlanLevel).pipe(
          mergeMap((planLevels) => {
            return from([
              showSnackBar({
                message: 'Plan Level added successfully',
                status: 'success',
              }),
              addPlanLevelSuccess({ planLevels }),
            ]);
          }),
          tap(() => {
            this.router.navigate([`../home/planLevelManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addPlanLevelFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([addPlanLevelFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  editPlanLevel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editPlanLevel),
      mergeMap((action) =>
        this.service.editPlanLevel(action.editPlanLevel).pipe(
          mergeMap((planLevels) => {
            return from([
              showSnackBar({
                message: 'Plan Level updated successfully',
                status: 'success',
              }),
              editPlanLevelSuccess({ planLevels }),
            ]);
          }),
          tap(() => {
            this.router.navigate([`../home/planLevelManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                editPlanLevelFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              editPlanLevelFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    );
  });

  deletePlanLevel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePlanLevel),

      mergeMap((action) =>
        this.service.deletePlanLevel(action.planLevelId, action.userId).pipe(
          mergeMap((planLevels) => {
            return from([
              showSnackBar({
                message: 'Plan Level Deleted Successfully',
                status: 'success',
              }),
              deletePlanLevelSuccess({ planLevels }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                deletePlanLevelFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              deletePlanLevelFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    )
  );
}
