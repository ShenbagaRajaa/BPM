import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  filter,
  fromEvent,
  interval,
  map,
  startWith,
  throttleTime,
  throwError,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { loginResponse } from '../models/loginResponse.model';
import { environment } from '../../../environment/environment';
import { NavigationEnd, Router } from '@angular/router';
import { logout } from '../store/auth-state/auth.action';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/api'; // Base API URL
  private accessTokenKey = 'accessToken'; // Key for storing access token in local storage
  private previousUrl = '';

  constructor(
    private http: HttpClient,
    private store: Store,
    private router: Router,
    private notificationSer: NotificationsService
  ) {
    this.setupActivityTracking(); // Initialize activity tracking

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.previousUrl = event.url;
      });
  }

  // Logs in the user by sending credentials to the backend
  login(email: string, passWord: string): Observable<loginResponse> {
    const params = {
      email: email,
      passWord: passWord,
    };

    return this.http.post<loginResponse>(
      `${this.apiUrl}/Authentication/login`,
      params
    );
  }

  // Refreshes the token for the user
  refreshToken(email: string, fromTakeAction: boolean = false) {
    const token = this.getToken(); // Retrieve the refresh token from storage
    return this.http
      .get(
        `${this.apiUrl}/Authentication/getrefreshtoken?email=${email}&token=${token}&fromTaskAction=${fromTakeAction}`
      )
      .pipe(
        map((response: any) => {
          if (response && response.accessToken) {
            this.setToken(response.accessToken); // Store the new access token
            this.notificationSer.startConnection();
          }
          return response;
        }),
        catchError((error) => {
          this.logout();
          throw error;
        })
      );
  }

  // Retrieves the access token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  // Stores the access token in local storage
  setToken(token: string): void {
    localStorage.setItem(this.accessTokenKey, token);
  }

  // Clears the access token from local storage
  clearToken(): void {
    localStorage.removeItem(this.accessTokenKey);
  }

  // Retrieves the user's email from local storage
  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  // Stores the user's email in local storage
  setEmail(email: string): void {
    localStorage.setItem('email', email);
  }

  // Clears the user's email from local storage
  clearEmail(): void {
    localStorage.removeItem('email');
  }

  // Sends a password reset link to the provided email
  sendResetLink(email: string): Observable<string> {
    const url = `${
      this.apiUrl
    }/Authentication/forgotpassword?email=${encodeURIComponent(email)}`;
    return this.http.put(url, null, { responseType: 'text' });
  }

  // Updates the user's password using the provided reset payload and token
  updatePassword(
    resetPayload: { ipaddress: string; password: string },
    token: string,
    CTAOptIn: boolean = true
  ): Observable<any> {
    if (!token) {
      return throwError(() => new Error('Token is missing.')); // Throw error if no token is provided
    }

    let url = `${this.apiUrl}/User/updateuserpassword?password=${resetPayload.password}&iPAddress=${resetPayload.ipaddress}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Set authorization header with the token
      'Content-Type': 'application/json',
    });

    if (CTAOptIn) {
      url = url + `&CTAOptIn=${CTAOptIn}`; // Append CTAOptIn parameter if true
    }

    return this.http.put<any>(url, resetPayload, { headers });
  }

  // Logs the user out by clearing local storage and dispatching logout action
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    localStorage.setItem('isTakeAction', '0');
    localStorage.removeItem('selectedPlanId');
    localStorage.removeItem('sequenceId');
    localStorage.removeItem('taskId');
    this.notificationSer.stopConnection();
    this.store.dispatch(logout());
    this.router.navigate(['']);
  }

  private lastActivityTime = new Date();
  private inactivityTimeout = 2 * 60 * 60 * 1000;

  // Sets up tracking for user activity (mouse, keyboard, scroll, etc.)
  setupActivityTracking() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const events = ['mousedown', 'keydown', 'scroll', 'mousemove'];
      events.forEach((event) => {
        fromEvent(document, event)
          .pipe(throttleTime(1000))
          .subscribe(() => {
            this.resetLastActivityTime(); // Reset activity time on user action
          });
      });

      // Check for inactivity every 5 minutes
      interval(5 * 60 * 1000)
        .pipe(startWith(0))
        .subscribe(() => {
          this.checkInactivity();
        });
    }
  }

  // Resets the last activity time to the current time
  resetLastActivityTime() {
    this.lastActivityTime = new Date();
  }

  // Checks if the user has been inactive for too long and logs them out if so
  checkInactivity() {
    const currentTime = new Date();
    const timeSinceLastActivity =
      currentTime.getTime() - this.lastActivityTime.getTime();

    if (timeSinceLastActivity > this.inactivityTimeout) {
      this.logout(); // Log out if the user has been inactive for more than the timeout
    }
  }

  getPreviousUrl(): string {
    return this.previousUrl || '/home/plans'; // fallback
  }
}
