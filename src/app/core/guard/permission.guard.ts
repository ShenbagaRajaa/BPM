import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, switchMap, take, map, timer, filter } from 'rxjs';
import { inject } from '@angular/core';
import { getAuthLoader, getPermissionIds } from '../store/auth-state/auth.selector';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route): Observable<boolean> => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService)

  const requiredPermissions: string[] = route.data['requiredPermissions'] || [];

  const checkPermissions = () => 
    store.select(getPermissionIds).pipe(
      take(1),
      map((userPermissions) => {
        
        if (!userPermissions || userPermissions.length === 0) {
          return false;
        }

        const hasPermission = requiredPermissions.every((permission) =>
          userPermissions.includes(permission)
        );
        
        if (!hasPermission) {
          const fallbackUrl = authService.getPreviousUrl();
          router.navigateByUrl(fallbackUrl);
          // router.navigate(['/home/unauthorized']);
          return false;
        }

        return true;
      })
    );

  return store.select(getAuthLoader).pipe(
    switchMap((loading) => {

      if (!loading) {
        return checkPermissions();
      }

      // While loading, poll every 4 seconds until we get permissions
      return timer(0, 4000).pipe(
        switchMap(() => checkPermissions()),
        filter(hasPermissions => hasPermissions), // Continue polling until we get permissions
        take(1) // Stop after we get permissions
      );
    })
  );
};