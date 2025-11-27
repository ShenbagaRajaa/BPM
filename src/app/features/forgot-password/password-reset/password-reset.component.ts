import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {
  Observable,
  map,
  catchError,
  throwError,
  takeUntil,
  Subject,
} from 'rxjs';
import { resetPassword } from '../../../core/store/auth-state/auth.action';
import { HttpClient } from '@angular/common/http';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Actions, ofType } from '@ngrx/effects';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import {
  getUserByEmail,
  getUserByEmailSuccess,
} from '../../../core/store/user-state/user.action';
import { selectUserByEmail } from '../../../core/store/user-state/user.selector';
@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
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
})
export class PasswordResetComponent implements OnInit {
  email: string = '';
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  agree: boolean = true;
  isAgree: boolean = false;
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
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private http: HttpClient,
    private dialog: MatDialog,
    private actions$: Actions
  ) {}
  // ngOnInit lifecycle hook to fetch the token and email from the query parameters
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.email = params['email'];

      localStorage.setItem('accessToken', params['token']);
      if (this.getEmail())
        this.store.dispatch(getUserByEmail({ email: this.getEmail() }));
    });

    this.actions$
      .pipe(ofType(getUserByEmailSuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.select(selectUserByEmail).subscribe((user) => {
          this.userDetails = user;
        });
      });

    this.token = this.route.snapshot.queryParamMap.get('token') || '';
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
  // Fetches the public IP address using an external API
  getIpAddress(): Observable<string> {
    const ipApiUrl = 'https://api.ipify.org?format=json';

    return this.http.get<{ ip: string }>(ipApiUrl).pipe(
      map((response) => response.ip),
      catchError(() => {
        return throwError(() => new Error('Failed to fetch IP address'));
      })
    );
  }
  // Signal to control password visibility
  hide = signal(true);
  isPasswordHidden(): boolean {
    return this.hide();
  }
  // Toggles the password visibility on click
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.preventDefault();
    event.stopPropagation();
  }
  // Prevents the 'Enter' key from triggering form submission
  preventEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      event.preventDefault();
    }
  }
  // Toggles password visibility when the visibility button is clicked
  togglePasswordVisibility(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.preventDefault();
    event.stopPropagation();
  }

  openPrivacyPolicy() {
    const dialogRef = this.dialog.open(PrivacyPolicyComponent, {
      width: '720px',
    });

    dialogRef.afterClosed().subscribe((data) => {
      this.isAgree = data;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
