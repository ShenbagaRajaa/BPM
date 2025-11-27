import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, mergeMap, tap } from 'rxjs/operators';
import { showSnackBar } from '../snackbar-state/snackbar.action';
import {
  addPlanType,
  addPlanTypeFailure,
  addPlanTypeSuccess,
  deletePlanType,
  deletePlanTypeFailure,
  deletePlanTypeSuccess,
  editPlanType,
  editPlanTypeFailure,
  editPlanTypeSuccess,
  getPlanType,
  getPlanTypeFailure,
  getPlanTypes,
  getPlanTypesFailure,
  getPlanTypesSuccess,
  getPlanTypeSuccess,
} from './plan-type.action';
import { PlanTypeService } from '../../services/plan-type.service';
import { Router } from '@angular/router';

@Injectable()
export class PlanTypesEffects {
  private actions$ = inject(Actions);
  private service = inject(PlanTypeService);
  private router = inject(Router);

  getPlanTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getPlanTypes),
      exhaustMap(() =>
        this.service.getPlanTypes().pipe(
          mergeMap((PlanType) =>
            from([getPlanTypesSuccess({ planTypes: PlanType })])
          ),
          catchError((error) =>
            from([getPlanTypesFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getPlanType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getPlanType),
      exhaustMap((action) =>
        this.service.getPlanType(action.planTypeId).pipe(
          mergeMap((planType) => from([getPlanTypeSuccess({ planType })])),
          catchError((error) => {
            return from([getPlanTypeFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  addPlanType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addPlanType),
      mergeMap((action) =>
        this.service.addPlanType(action.addPlanType).pipe(
          mergeMap((planTypes) => {
            return from([
              showSnackBar({
                message: 'Plan Type added successfully',
                status: 'success',
              }),
              addPlanTypeSuccess({ planTypes }),
            ]);
          }),
          tap(() => {
            this.router.navigate([`../home/planTypeManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addPlanTypeFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([addPlanTypeFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });
  editPlanType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editPlanType),
      mergeMap((action) =>
        this.service.editPlanType(action.editPlanType).pipe(
          mergeMap((planTypes) => {
            return from([
              showSnackBar({
                message: 'Plan Type updated successfully',
                status: 'success',
              }),
              editPlanTypeSuccess({ planTypes }),
            ]);
          }),
          tap(() => {
            this.router.navigate([`../home/planTypeManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                editPlanTypeFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([editPlanTypeFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  deletePlanType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePlanType),

      mergeMap((action) =>
        this.service.deletePlanType(action.planTypeId, action.userId).pipe(
          mergeMap((planTypes) => {
            return from([
              showSnackBar({
                message: 'Plan Type Deleted Successfully',
                status: 'success',
              }),
              deletePlanTypeSuccess({ planTypes }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                deletePlanTypeFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              deletePlanTypeFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    )
  );
}
