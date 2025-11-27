import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, mergeMap, tap } from 'rxjs/operators';
import {
  addPlan,
  addPlanFailure,
  addPlanSuccess,
  deletePlan,
  deletePlanFailure,
  deletePlanSuccess,
  editPlan,
  editPlanFailure,
  editPlanSuccess,
  getAllPlan,
  getAllPlanFailure,
  getAllPlanSuccess,
  getPlanById,
  getPlanByIdFailure,
  getPlanByIdSuccess,
  getPlanByStatus,
  getPlanByStatusFailure,
  getPlanByStatusSuccess,
  updatePlanStatus,
  updatePlanStatusFailure,
  updatePlanStatusSuccess,
} from './plan.action';
import { PlanDetailsService } from '../../services/plan-details.service';
import { showSnackBar } from '../snackbar-state/snackbar.action';
import { Router } from '@angular/router';

@Injectable()
export class PlanEffects {
  private actions$ = inject(Actions);
  private planService = inject(PlanDetailsService);
  private router = inject(Router);

  getPlans$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getAllPlan),
      mergeMap(() =>
        this.planService.getAllPlan().pipe(
          mergeMap((plans) => {
            return from([getAllPlanSuccess({ plans })]);
          }),
          catchError((error) =>
            from([getAllPlanFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getPlan$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getPlanById),
      exhaustMap((action) =>
        this.planService.getPlanById(action.id).pipe(
          mergeMap((plan) => from([getPlanByIdSuccess({ plan })])),
          catchError((error) =>
            from([getPlanByIdFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getPlanByStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getPlanByStatus),
      exhaustMap((action) =>
        this.planService.getPlanByStatus(action.status).pipe(
          mergeMap((plans) => from([getPlanByStatusSuccess({ plans })])),
          catchError((error) =>
            from([getPlanByStatusFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  addPlan$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addPlan),
      mergeMap((action) =>
        this.planService.addPlan(action.addPlan).pipe(
          mergeMap((plans) => {
            return from([
              showSnackBar({
                message: 'Plan added successfully',
                status: 'success',
              }),
              addPlanSuccess({ plans }),
            ]);
          }),
          tap(() => {
            getAllPlan();
            this.router.navigate(['/home/plans']);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addPlanFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([addPlanFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  editPlan$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editPlan),
      mergeMap((action) =>
        this.planService.EditPlan(action.editPlan).pipe(
          mergeMap((plans) => {
            return from([
              showSnackBar({
                message: 'Plan edited successfully',
                status: 'success',
              }),
              editPlanSuccess({ plans }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                editPlanFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([editPlanFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  deletePlan$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deletePlan),
      mergeMap((action) =>
        this.planService.deletePlan(action.planId).pipe(
          mergeMap((plans) => {
            return from([
              showSnackBar({
                message: 'Plan deleted successfully',
                status: 'success',
              }),
              deletePlanSuccess({ plans }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                deletePlanFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([deletePlanFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  updatePlanStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePlanStatus),
      mergeMap((action) =>
        this.planService.markPlanStatus(action.planId, action.status).pipe(
          mergeMap(() => {
            return from([
              showSnackBar({
                message: action.successMessage,
                status: 'success',
              }),
              getPlanById({ id: action.planId }),
              updatePlanStatusSuccess({
                planId: action.planId,
                status: action.status,
              }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                updatePlanStatusFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              updatePlanStatusFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    )
  );
}
