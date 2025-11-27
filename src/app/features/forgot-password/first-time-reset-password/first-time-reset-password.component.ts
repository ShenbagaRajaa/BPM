import { NgIf } from '@angular/common';
import { Component, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Observable,
  map,
  catchError,
  throwError,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  reloadLogin,
  reloadLoginSuccess,
  resetPassword,
} from '../../../core/store/auth-state/auth.action';
import { HttpClient } from '@angular/common/http';
import { selectUser } from '../../../core/store/auth-state/auth.selector';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { environment } from '../../../../environment/environment';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';

@Component({
  selector: 'app-first-time-reset-password',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    NgIf,
    MatCheckboxModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './first-time-reset-password.component.html',
  styleUrl: './first-time-reset-password.component.css',
})
export class FirstTimeResetPasswordComponent {
  email: string = '';
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  agree: boolean = true;
  isAgree: boolean = false;
  errorMessage: string = '';
  userDetails: addUserModel = {
    id: 0,
    title: '',
    employeeFirstName: '',
    employeeLastName: '',
    drTeamId: 0,
    drTeamSkill: '',
    email: '',
    mobileNumber: '',
    role: 0,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    emergencyContactName: '',
    emergencyContactEmail: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    isActive: true,
    profilePicture: null,
    address2: '',
    createdBy: 0,
    uploadPhotoPath: 'assets/sample-image.jpg',
    permissionIds: '',
    lastChangedBy: 0,
    isPasswordSetByUser: undefined,
  };
  baseUrl = environment.apiUrl + '/';
  image = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private http: HttpClient,
    private actions$: Actions,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Extract token and email from query parameters
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.email = params['email'];
      localStorage.setItem('accessToken', this.token);
      // Dispatch reload login action if email exists
      if (this.getEmail())
        this.store.dispatch(reloadLogin({ email: this.getEmail() }));
    });
    // Listen for login success and update user details
    this.actions$
      .pipe(ofType(reloadLoginSuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.select(selectUser).subscribe((res) => {
          this.userDetails = res.user;
          this.image = this.image + res.user.uploadPhotoPath;
        });
      });
    // Retrieve token from snapshot (alternative to subscription)
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }
  // Validate password strength
  isValidPassword(): boolean {
    if (this.newPassword.length < 8) {
      this.errorMessage = 'Password must have 8 characters';
      return false;
    }

    if (!/[A-Z]/.test(this.newPassword)) {
      this.errorMessage = 'Password must have atleast one uppercase';
      return false;
    }

    if (!/[a-z]/.test(this.newPassword)) {
      this.errorMessage = 'Password must have atleast one lowercase';
      return false;
    }

    if (!/\d/.test(this.newPassword)) {
      this.errorMessage = 'Password must have atleast one number';
      return false;
    }

    if (!/[!@#$%^&*(),.?:{}|<>]/.test(this.newPassword)) {
      this.errorMessage = 'Password must have atleast one special character';
      return false;
    }

    if (!this.isAgree) {
      this.errorMessage = 'Please accept the privacy policy';
      return false;
    }

    if (!this.agree) {
      this.errorMessage = 'Please accept understand data rates';
      return false;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Password doesnot match';
      return false;
    }

    return true;
  }
  // Open the privacy policy modal dialog
  openPrivacyPolicy() {
    const dialogRef = this.dialog.open(PrivacyPolicyComponent, {
      width: '720px',
    });

    dialogRef.afterClosed().subscribe((data) => {
      this.isAgree = data;
    });
  }
  // Handle form submission
  onSubmit() {
    let ip: string = '';
    this.getIpAddress().subscribe((data) => (ip = data));
    // Dispatch reset password action
    this.store.dispatch(
      resetPassword({
        token: this.token || localStorage.getItem('accessToken') || '',
        newPassword: this.newPassword,
        ipAddress: ip || '',
        CTAOptIn: this.agree,
      })
    );
  }
  // Fetch user's IP address
  getIpAddress(): Observable<string> {
    const ipApiUrl = 'https://api.ipify.org?format=json';

    return this.http.get<{ ip: string }>(ipApiUrl).pipe(
      map((response) => response.ip),
      catchError(() => {
        return throwError(() => new Error('Failed to fetch IP address'));
      })
    );
  }
  // Signal for password visibility toggle
  hide = signal(true);
  isPasswordHidden(): boolean {
    return this.hide();
  }
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.preventDefault();
    event.stopPropagation();
  }
  // Prevent form submission on Enter key press
  preventEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      event.preventDefault();
    }
  }
  // Toggle password visibility
  togglePasswordVisibility(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.preventDefault();
    event.stopPropagation();
  }
  // Extract email from JWT token stored in localStorage
  getEmail(): string {
    if (typeof window !== 'undefined' && window?.localStorage) {
      const encryptedToken = this.token;
      if (encryptedToken) {
        try {
          const decoded = this.decodeJWT(encryptedToken);
          return decoded.email;
        } catch (error) {
          return '';
        }
      }
    }
    return '';
  }

  // Decode JWT to extract payload
  decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      return null;
    }
  }

  // Cleanup subscriptions to prevent memory leaks
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
