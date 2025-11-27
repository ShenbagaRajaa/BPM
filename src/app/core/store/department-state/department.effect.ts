import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, mergeMap } from 'rxjs/operators';
import { showSnackBar } from '../snackbar-state/snackbar.action';
import { DepartmentService } from '../../services/department.service';
import {
  addDepartment,
  addDepartmentFailure,
  addDepartmentSuccess,
  deleteDepartment,
  deleteDepartmentFailure,
  deleteDepartmentSuccess,
  editDepartment,
  editDepartmentFailure,
  editDepartmentSuccess,
  getDepartment,
  getDepartmentFailure,
  getDepartments,
  getDepartmentsSuccess,
  getDepartmentSuccess,
} from './department.action';
import { Router } from '@angular/router';

@Injectable()
export class DepartmentsEffects {
  private actions$ = inject(Actions);
  private service = inject(DepartmentService);
  private router = inject(Router);

  getDepartments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getDepartments),
      exhaustMap(() =>
        this.service.getDepartments().pipe(
          mergeMap((department) =>
            from([getDepartmentsSuccess({ departments: department })])
          ),
          catchError((error) =>
            from([getDepartmentFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getDepartment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getDepartment),
      exhaustMap((action) =>
        this.service.getDepartment(action.departmentId).pipe(
          mergeMap((department) =>
            from([getDepartmentSuccess({ department })])
          ),
          catchError((error) => {
            return from([
              getDepartmentFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    );
  });

  addDepartment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addDepartment),
      mergeMap((action) =>
        this.service.addDepartment(action.addDepartment).pipe(
          mergeMap((departments) => {
            return from([
              showSnackBar({
                message: 'Department added successfully',
                status: 'success',
              }),
              addDepartmentSuccess({ departments }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addDepartmentFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              addDepartmentFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    );
  });

  editDepartment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editDepartment),
      mergeMap((action) =>
        this.service.editDepartment(action.editDepartment).pipe(
          mergeMap((departments) => {
            this.router.navigate([`../home/departmentManagement/`]);
            return from([
              showSnackBar({
                message: 'Department updated successfully',
                status: 'success',
              }),
              editDepartmentSuccess({ departments }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                editDepartmentFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              editDepartmentFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    );
  });

  deleteDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteDepartment),

      mergeMap((action) =>
        this.service.deleteDepartment(action.departmentId, action.userId).pipe(
          mergeMap((departments) => {
            return from([
              showSnackBar({
                message: 'Department Deleted Successfully',
                status: 'success',
              }),
              deleteDepartmentSuccess({ departments }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                deleteDepartmentFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              deleteDepartmentFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    )
  );
}
