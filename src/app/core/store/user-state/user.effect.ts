import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, mergeMap } from 'rxjs/operators';
import { showSnackBar } from '../snackbar-state/snackbar.action';
import { UserService } from '../../services/user.service';
import {
  addUser,
  addUserFailure,
  addUserSuccess,
  deleteUser,
  deleteUserFailure,
  deleteUserSuccess,
  getAllUser,
  getAllUserFailure,
  getAllUserSuccess,
  getDrSkill,
  getDrSkillFailure,
  getDrSkillSuccess,
  getDrTeam,
  getDrTeamFailure,
  getDrTeamSuccess,
  getUserByEmail,
  getUserByEmailFailure,
  getUserByEmailSuccess,
  getUserByRoleId,
  getUserByRoleIdFailure,
  getUserByRoleIdSuccess,
  unlockUserAccount,
  unlockUserAccountFailure,
  unlockUserAccountSuccess,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from './user.action';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private service = inject(UserService);

  getAllUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getAllUser),
      exhaustMap(() =>
        this.service.getAllUser().pipe(
          mergeMap((users) => from([getAllUserSuccess({ users })])),
          catchError((error) =>
            from([
              getAllUserFailure({ error: error?.error?.detail ?? 'Error' }),
            ])
          )
        )
      )
    );
  });

  getDrTeam$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getDrTeam),
      exhaustMap((action) =>
        this.service.getDrTeam(action.id).pipe(
          mergeMap((drTeam) => from([getDrTeamSuccess({ drTeam })])),
          catchError((error) =>
            from([getDrTeamFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getDrSill$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getDrSkill),
      exhaustMap((action) =>
        this.service.getDrSkill(action.id).pipe(
          mergeMap((drSkill) => from([getDrSkillSuccess({ drSkill })])),
          catchError((error) =>
            from([getDrSkillFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getUserByEmail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getUserByEmail),
      exhaustMap((action) =>
        this.service.getUserByEmail(action.email).pipe(
          mergeMap((user) => from([getUserByEmailSuccess({ user })])),
          catchError((error) =>
            from([getUserByEmailFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getUserByRoleId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getUserByRoleId),
      exhaustMap((action) =>
        this.service.getByRoleId(action.roleId).pipe(
          mergeMap((usersByRole) =>
            from([getUserByRoleIdSuccess({ usersByRole })])
          ),
          catchError((error) =>
            from([getUserByRoleIdFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  addNewUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addUser),
      exhaustMap((action) =>
        this.service.addUser(action.addUser).pipe(
          mergeMap((users) =>
            from([
              showSnackBar({
                message: 'User added successfully',
                status: 'success',
              }),
              getAllUser(),
              addUserSuccess({ users }),
            ])
          ),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addUserFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([addUserFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateUser),
      exhaustMap((action) =>
        this.service.updateUser(action.updateUser).pipe(
          mergeMap((users) =>
            from([
              showSnackBar({
                message: 'User updated successfully',
                status: 'success',
              }),
              getAllUser(),
              updateUserSuccess({ users }),
            ])
          ),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                updateUserFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([updateUserFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUser),

      mergeMap((action) =>
        this.service.deleteUser(action.userId).pipe(
          mergeMap(() => {
            return from([
              showSnackBar({
                message: 'User Deleted Successfully',
                status: 'success',
              }),
              deleteUserSuccess(),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                deleteUserFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([deleteUserFailure({ error: error?.error?.detail })]);
          })
        )
      )
    )
  );

  unlockUserAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(unlockUserAccount),

      mergeMap((action) =>
        this.service.unlockUesrAccount(action.email).pipe(
          mergeMap(() => {
            return from([
              showSnackBar({
                message: 'User Account Unlocked Successfully',
                status: 'success',
              }),
              unlockUserAccountSuccess(),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                unlockUserAccountFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([unlockUserAccountFailure({ error: error?.error?.detail })]);
          })
        )
      )
    )
  );
}
