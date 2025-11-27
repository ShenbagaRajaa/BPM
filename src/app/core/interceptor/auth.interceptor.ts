import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../store/auth-state/auth.action';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const store = inject(Store);
  const router = inject(Router);
  let authReq = req;
  let token = null;

  // API URL for making requests.
  const apiUrl = environment.apiUrl + '/api';

  // List of URLs to exclude from the interceptor (e.g., password update endpoint).
  const excludedUrls = [`${apiUrl}/User/updateuserpassword`];

  // Check if the current request URL is in the excluded list.
  const isExcluded = excludedUrls.some((url) => req.url === url);

  // If the request URL is excluded, skip the interceptor logic and proceed.
  if (isExcluded) {
    return next(req);
  }

  // Check if the window object is defined (to ensure it's client-side) and retrieve the token.
  if (typeof window !== 'undefined') {
    token = authService.getToken();
  }

  // If a token exists, clone the request and add the Authorization header with the token.
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  // Proceed with the request (either original or with Authorization header) and handle errors.
  return next(authReq).pipe(
    catchError((error) => {
      // Check if the error is an authorization failure.
      if (error.error.detail === 'Authorization Failed.') {
        const email = authService.getEmail() || ''; // Get the email of the user (used for refreshing the token).
        let fromTakeAction =
          localStorage.getItem('isTakeAction') === '1' ? true : false;

        if (fromTakeAction) {
          localStorage.removeItem('isTakeAction');
          store.dispatch(logout());
          router.navigate(['/login']);
        }
        // Attempt to refresh the token by calling the refreshToken method.
        return authService.refreshToken(email, fromTakeAction).pipe(
          // If token refresh is successful, clone the request again with the new token.
          switchMap((newToken) => {
            const refreshedReq = req.clone({
              headers: req.headers.set(
                'Authorization',
                `Bearer ${newToken.token}`
              ),
            });
            return next(refreshedReq);
          }),
          // If the token refresh fails, log out the user, navigate to the login page, and throw an error.
          catchError((refreshError) => {
            store.dispatch(logout());
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }
      // If the error is not related to authorization, simply throw the error.
      return throwError(() => error);
    })
  );
};
