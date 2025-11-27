import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, mergeMap, tap } from 'rxjs/operators';
import { showSnackBar } from '../snackbar-state/snackbar.action';
import { RoleService } from '../../services/role.service';
import {
  getRoles,
  getRolesSuccess,
  getRolesFailure,
  getRole,
  getRoleSuccess,
  getRoleFailure,
  addRole,
  addRoleSuccess,
  addRoleFailure,
  editRole,
  editRoleSuccess,
  editRoleFailure,
  deleteRole,
  deleteRoleSuccess,
  deleteRoleFailure,
} from './role.action';
import { Router } from '@angular/router';

@Injectable()
export class RoleEffects {
  private actions$ = inject(Actions);
  private service = inject(RoleService);
  private router = inject(Router);

  getRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getRoles),
      exhaustMap(() =>
        this.service.getRoles().pipe(
          mergeMap((roles) => {
            return from([getRolesSuccess({ roles })]);
          }),
          catchError((error) =>
            from([
              getRolesFailure({
                error:
                  error?.error?.detail ??
                  'Something went wrong. Try Again Later',
              }),
            ])
          )
        )
      )
    );
  });

  getRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getRole),
      exhaustMap((action) =>
        this.service.getRole(action.roleId).pipe(
          mergeMap((role) => from([getRoleSuccess({ role })])),
          catchError((error) => {
            return from([getRoleFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  addRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addRole),
      mergeMap((action) =>
        this.service.addRole(action.addRole, action.selectedPermissions).pipe(
          mergeMap((message) => {
            {
              this.router.navigate([`../home/roleManagement/`]);
              return [
                showSnackBar({
                  message: 'Role added successfully',
                  status: 'success',
                }),
                addRoleSuccess({ message }),
              ];
            }
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addRoleFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([addRoleFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  editRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editRole),
      mergeMap((action) =>
        this.service.editRole(action.editRole, action.selectedPermissions).pipe(
          mergeMap((message) => {
            return from([
              showSnackBar({
                message: 'Role updated successfully',
                status: 'success',
              }),
              editRoleSuccess({ message }),
            ]);
          }),
          tap(() => {
            this.router.navigate([`../home/roleManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                editRoleFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([editRoleFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteRole),

      mergeMap((action) =>
        this.service.deleteRole(action.roleId, action.userId).pipe(
          mergeMap((message) => {
            return from([
              showSnackBar({
                message: 'Role Deleted Successfully',
                status: 'success',
              }),
              deleteRoleSuccess({ message }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                deleteRoleFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([deleteRoleFailure({ error: error?.error?.detail })]);
          })
        )
      )
    )
  );
}
