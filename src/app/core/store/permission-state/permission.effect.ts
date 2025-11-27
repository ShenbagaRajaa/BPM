import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
import {
  addPermission,
  addPermissionFailure,
  addPermissionSuccess,
  editPermission,
  editPermissionFailure,
  editPermissionSuccess,
  getPermission,
  getPermissionFailure,
  getPermissions,
  getPermissionsByRoleId,
  getPermissionsByRoleIdFailure,
  getPermissionsByRoleIdSuccess,
  getPermissionsFailure,
  getPermissionsSuccess,
  getPermissionSuccess,
} from './permission.action';
import { PermissionService } from '../../services/permission.service';
import { Router } from '@angular/router';
import { showSnackBar } from '../snackbar-state/snackbar.action';

@Injectable()
export class PermissionsEffects {
  private actions$ = inject(Actions);
  private service = inject(PermissionService);
  private router = inject(Router);

  getPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPermissions),
      mergeMap(() =>
        this.service.getPermissions().pipe(
          map((permissions) => getPermissionsSuccess({ permissions })),
          catchError((error) =>
            of(getPermissionsFailure({ error: error?.error?.detail }))
          )
        )
      )
    )
  );

  getPermission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPermission),
      mergeMap((action) =>
        this.service.getPermission(action.permissionId).pipe(
          map((permission) => getPermissionSuccess({ permission })),
          catchError((error) =>
            from([getPermissionFailure({ error: error?.error?.detail })])
          )
        )
      )
    )
  );

  getPermissionsByRoleId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getPermissionsByRoleId),
      exhaustMap((action) =>
        this.service.getPermissionsByRoleId(action.roleId).pipe(
          mergeMap((permissionByRoleId) =>
            from([getPermissionsByRoleIdSuccess({ permissionByRoleId })])
          ),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                getPermissionsByRoleIdFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              getPermissionsByRoleIdFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    );
  });

  addPermission$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addPermission),
      mergeMap((action) =>
        this.service.addPermissionByRoleId(action.addPermission).pipe(
          mergeMap((permissions) => {
            return from([
              showSnackBar({
                message: 'Permission added successfully',
                status: 'success',
              }),
              addPermissionSuccess({ permissions }),
            ]);
          }),
          tap(() => {
            this.router.navigate([`../home/userManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addPermissionFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              addPermissionFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    );
  });

  editPermission$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editPermission),
      mergeMap((action) =>
        this.service.editPermissionByRoleId(action.editPermission).pipe(
          mergeMap((permissions) => {
            return from([
              showSnackBar({
                message: 'Permission updated successfully',
                status: 'success',
              }),
              editPermissionSuccess({ permissions }),
            ]);
          }),
          tap(() => {
            this.router.navigate([`../home/userManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                editPermissionFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              editPermissionFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    );
  });
}
