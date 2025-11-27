import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, mergeMap } from 'rxjs/operators';
import { showSnackBar } from '../snackbar-state/snackbar.action';
import { AuthService } from '../../services/auth.service';
import {
  login,
  loginSuccess,
  loginFailure,
  forgotPassword,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  reloadLogin,
  reloadLoginFailure,
  reloadLoginSuccess,
  resetPassword,
  resetPasswordFailure,
  resetPasswordSuccess,
} from './auth.action';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Store } from '@ngrx/store';
import { getAllUser } from '../user-state/user.action';

@Injectable()
export class AuthEffects {
  // constructor(private actions$: Actions,private store:Store, private service: AuthService,private userService : UserService, private router : Router) {}
  private actions$ = inject(Actions);
  private service = inject(AuthService);
  private store = inject(Store);
  private userService = inject(UserService);
  private router = inject(Router);

  // Effect to handle user login
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(login),
      exhaustMap((action) =>
        this.service.login(action.userName, action.passWord).pipe(
          mergeMap((loginResponse) => {
            if (loginResponse) {
              // Navigate to home upon successful login
              // if (loginResponse.user.permissionIds.includes('70')) {
              //   this.router.navigate(['home/dashboard']);
              // } else {
              //   this.router.navigate(['home/plans']);
              // }
              return from([
                showSnackBar({
                  message: 'Login successfully',
                  status: 'success',
                }),
                loginSuccess({ loginResponse }),
              ]);
            } else {
              // Navigate back to login page on failure
              this.router.navigate(['']);
              this.store.dispatch(getAllUser());
              return from([
                showSnackBar({
                  message: 'Invalid Credentials',
                  status: 'error',
                }),
                loginFailure({ error: 'Invalid Credentials' }),
              ]);
            }
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                loginFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([loginFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  // Effect to handle forgot password request
  forgotPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(forgotPassword),
      exhaustMap((action) =>
        this.service.sendResetLink(action.email).pipe(
          mergeMap((response) => {
            if (response) {
              return from([
                showSnackBar({
                  message: 'Reset link sent successfully',
                  status: 'success',
                }),
                forgotPasswordSuccess({ message: response }),
              ]);
            } else {
              return from([
                showSnackBar({
                  message: 'Failed to send reset link.',
                  status: 'error',
                }),
                forgotPasswordFailure({ error: 'Unknown error occurred' }),
              ]);
            }
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                forgotPasswordFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              forgotPasswordFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    );
  });

  // Effect to reload user login data
  reloadLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(reloadLogin),
      exhaustMap((action) =>
        this.userService.getUserByEmail(action.email).pipe(
          mergeMap((user) => from([reloadLoginSuccess({ user })])),
          catchError((error) =>
            from([reloadLoginFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  // Effect to handle user password reset
  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resetPassword),
      exhaustMap((action) =>
        this.service
          .updatePassword(
            { password: action.newPassword, ipaddress: action.ipAddress },
            action.token,
            action.CTAOptIn
          )
          .pipe(
            mergeMap((response) => {
              // Navigate to login page after password reset
              this.router.navigate(['']);

              localStorage.removeItem('accessToken');
              return from([
                showSnackBar({
                  message: response?.detail,
                  status: 'success',
                }),
                resetPasswordSuccess({ message: response?.detail }),
              ]);
            }),
            catchError((error) => {
              if (error?.error?.detail !== 'Authorization Failed.') {
                return from([
                  resetPasswordFailure({ error: error?.error?.detail }),
                  showSnackBar({
                    message: error?.error?.detail,
                    status: 'error',
                  }),
                ]);
              }
              return from([
                resetPasswordFailure({ error: error?.error?.detail }),
              ]);
            })
          )
      )
    )
  );
}
