import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { SplashScreenComponent } from './shared/splash-screen/splash-screen.component';
import { AsyncPipe, isPlatformBrowser, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { loginSuccess, reloadLogin } from './core/store/auth-state/auth.action';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './core/services/auth.service';
import { App } from '@capacitor/app';
import { CommonService } from './core/services/common.service';
import { VersionCheckService } from '../../scripts/check-version';
import { Actions, ofType } from '@ngrx/effects';
import {
  getPermissionIds,
  selectUser,
} from './core/store/auth-state/auth.selector';
import { filter, take } from 'rxjs';
import { environment } from '../environment/environment';
import { CapacitorHttp } from '@capacitor/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SnackbarComponent,
    SplashScreenComponent,
    NgIf,
    MatRippleModule,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ACOMDev';

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private authService: AuthService,
    public commonService: CommonService,
    public versionCheckService: VersionCheckService,
    private actions$: Actions,
    private router: Router,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.versionCheckService.initVersionCheck();
      this.setupUnloadListeners();
      this.setupBackButtonHandler();
      this.appUrlOpen();
    }

    this.route.queryParams.subscribe((params) => {
      const hasTaskParams =
        params['brPlanId'] &&
        params['sequenceId'] &&
        params['taskId'] &&
        params['isLogin'] === undefined &&
        params['_'] === undefined;

      if (hasTaskParams) {
        localStorage.setItem(
          'deepLinkData',
          JSON.stringify({
            brPlanId: params['brPlanId'],
            sequenceId: params['sequenceId'],
            taskId: params['taskId'],
            retries: params['retries'],
            eventTypeId: params['eventTypeId'],
          })
        );
        this.router.navigate(['/login']);
        return;
      }

      const emailFromToken = this.extractEmailFromStoredToken();
      if (emailFromToken) {
        this.authService.setEmail(emailFromToken);
        this.store.dispatch(reloadLogin({ email: emailFromToken }));
      }
    });

    this.actions$.pipe(ofType(loginSuccess)).subscribe(() => {
      // -----------------------------
      // 1. Save token & email from login.user
      // -----------------------------
      this.store
        .select(selectUser)
        .pipe(take(1))
        .subscribe((res) => {
          this.authService.setEmail(res.user.email);
          this.authService.setToken(res.token);

          // Store session flag
          sessionStorage.setItem('tabAlive', 'true');

          // ------------------------------------
          // 2. Handle FIRST-TIME PASSWORD RESET
          // ------------------------------------
          if (
            res.user.isPasswordSetByUser === false &&
            res.user.isPasswordSetByUser !== undefined
          ) {
            this.router.navigate(['first-reset']);
            return;
          }

          // ------------------------------------
          // 3. Deep Link handling AFTER login
          // ------------------------------------
          const deepLink = localStorage.getItem('deepLinkData');

          if (deepLink) {
            const data = JSON.parse(deepLink);
            localStorage.removeItem('deepLinkData');

            this.router.navigate(['/home/taskAction'], {
              queryParams: {
                brPlanId: data.brPlanId,
                sequenceId: data.sequenceId,
                taskId: data.taskId,
                retries: data.retries,
                eventTypeId: data.eventTypeId,
                isLogin: true,
              },
            });
            return;
          }

          // ------------------------------------
          // 4. Normal Permission-based Navigation
          // ------------------------------------
          this.store
            .select(getPermissionIds)
            .pipe(take(1))
            .subscribe((permissionIds) => {
              if (permissionIds.includes('70')) {
                this.router.navigate(['home/dashboard']);
              } else {
                this.router.navigate(['home/plans']);
              }
            });
        });
    });
    // this.actions$.pipe(ofType(loginSuccess)).subscribe(() => {
    //   const deepLink = localStorage.getItem('deepLinkData');

    //   if (deepLink) {
    //     const data = JSON.parse(deepLink);
    //     localStorage.removeItem('deepLinkData');
    //     this.router.navigate(['/home/taskAction'], {
    //       queryParams: {
    //         brPlanId: data.brPlanId,
    //         sequenceId: data.sequenceId,
    //         taskId: data.taskId,
    //         retries: data.retries,
    //         eventTypeId: data.eventTypeId,
    //         isLogin: true,
    //       },
    //     });

    //     return;
    //   }

    //   // Default login success redirection
    //   this.store
    //     .select(getPermissionIds)
    //     .pipe(take(1))
    //     .subscribe((permissionIds) => {
    //       if (permissionIds.includes('70')) {
    //         this.router.navigate(['home/dashboard']);
    //       } else {
    //         this.router.navigate(['home/plans']);
    //       }
    //     });
    // });
  }

  private decodeJWT(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  private extractEmailFromStoredToken(): string {
    if (typeof window === 'undefined' || !window.localStorage) return '';
    const token = localStorage.getItem('accessToken');
    if (!token) return '';
    const decoded = this.decodeJWT(token);
    return decoded?.email || '';
  }

  private setupUnloadListeners(): void {
    const SESSION_FLAG = 'tabAlive';
    const CLOSE_FLAG = 'wasTabClosed';

    const wasTabClosed = localStorage.getItem(CLOSE_FLAG);
    const isSessionActive = sessionStorage.getItem(SESSION_FLAG);

    if (wasTabClosed && !isSessionActive) {
      localStorage.clear();
    }

    localStorage.removeItem(CLOSE_FLAG);

    sessionStorage.setItem(SESSION_FLAG, 'true');

    window.addEventListener('beforeunload', () => {
      localStorage.setItem(CLOSE_FLAG, 'true');
    });
  }

  private setupBackButtonHandler() {
    App.addListener('backButton', ({ canGoBack }) => {
      canGoBack ? window.history.back() : this.exitApp();
    });
  }

  // private appUrlOpen() {
  //   App.addListener('appUrlOpen', async (data: any) => {
  //     console.log('Deep link received:', data.url);

  //     let url = data.url;

  //     if (url.includes('/API/')) {
  //       console.log('Ignoring API link, waiting for redirect...');
  //       setTimeout(() => {
  //         window.location.href = url;
  //         console.log(url);

  //       }, 300);
  //       return; // ❗ Do not process further
  //     }
  //     let baseUrlToRemove = environment.baseUrl;
  //     let path = url.replace(baseUrlToRemove, '');

  //     // 2. Split into route + query params
  //     let parts = path.split('?');
  //     let routePath = parts[0]; // "/forgot-password"
  //     let queryString = parts[1] || ''; // "brPlanId=...&taskId=..."
  //     let queryParams = this.parseQueryParams(queryString);

  //     console.log('Route:', routePath);
  //     console.log('Params:', queryParams);

  //     // 3. Save deep-link request in storage
  //     // localStorage.setItem('deepLinkNavigateTo', routePath);
  //     localStorage.setItem('deepLinkData', JSON.stringify(queryParams));

  //     // 4. Check login state
  //     const token = localStorage.getItem('accessToken');

  //     if (!token && routePath === '/home/taskAction') {
  //       console.log('Not logged in → redirecting to login');
  //       this.ngZone.run(() => {
  //         this.router.navigate(['/login']);
  //       });
  //       return;
  //     }

  //     // 5. Already logged in → navigate directly
  //     console.log('Already logged in → navigating now');
  //     this.ngZone.run(() => {
  //       this.router.navigate([routePath], { queryParams });
  //     });
  //   });
  // }
  private appUrlOpen() {
    App.addListener('appUrlOpen', async (data: any) => {
      let url = data.url;
      console.log('Deep link received:', url);

      // 1. If URL is API → fetch final redirect
      if (url.includes('/API/')) {
        console.log('API link detected → resolving redirect...');

        try {
          console.log('ulr',url);
         const response = await CapacitorHttp.get({
            url: url,
            headers: {},
          });

        // // final redirected URL (VERY IMPORTANT)
        let finalUrl = response.url;
        console.log("Resolved redirected URL:", finalUrl);
 // expecting { redirect: "..." }
console.log('res', response);
console.log('result', finalUrl);


          if (!finalUrl) {
            console.log('Redirect data missing. Waiting...');
            return;
          }

          console.log('Resolved redirect to:', finalUrl);

          this.handleFinalDeepLink(finalUrl);
        } catch (err) {
          console.error('API redirect fetch failed:', err);
        }

        return; // stop here
      }

      // 2. Normal URL (already final)
      this.handleFinalDeepLink(url);
    });
  }

  private handleFinalDeepLink(finalUrl: string) {
    // strip domain
    const path = finalUrl
      .replace('https://www.acombpm.com/BRMgr-uat', '')
      .replace('https://www.acombpm.com', '');

    const [routePath, queryStr] = path.split('?');
    const queryParams = this.parseQueryParams(queryStr || '');

    console.log('Route:', routePath);
    console.log('Params:', queryParams);

    localStorage.setItem('deepLinkData', JSON.stringify(queryParams));

    const token = localStorage.getItem('accessToken');

    if (!token && routePath === '/home/taskAction') {
      console.log('Not logged in → redirect to login');
      this.ngZone.run(() => this.router.navigate(['/login']));
      return;
    }

    console.log('Already logged in → navigate to route');
    this.ngZone.run(() => {
      this.router.navigate([routePath], { queryParams });
    });
  }

  private exitApp() {
    App.exitApp();
  }

  private parseQueryParams(queryString: string): any {
    let params: any = {};
    queryString.split('&').forEach((pair) => {
      if (!pair) return;
      const [key, value] = pair.split('=');
      params[key] = decodeURIComponent(value || '');
    });
    return params;
  }
}
