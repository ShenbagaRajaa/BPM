import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ForgotpasswordComponent {
  forgotPasswordForm: FormGroup;
  isSubmitted = false;
  statusMessage = {
    type: '',
    message: '',
  };

  constructor(
    private fb: FormBuilder,
    private forgotPasswordService: AuthService
  ) {
    // Initializing form with email field and validators
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  // Getter to access the email form control
  get emailControl() {
    return this.forgotPasswordForm.get('email');
  }
  // Function to return appropriate error message for email field
  getErrorMessage() {
    if (this.emailControl?.hasError('required')) {
      return 'Please enter your registered email address.';
    }
    return this.emailControl?.hasError('email')
      ? 'Please enter a valid email address'
      : '';
  }
  // Function to handle form submission
  onSubmit() {
    const email = this.forgotPasswordForm.value.email;

    this.forgotPasswordService.sendResetLink(email).subscribe(
      () => {
        this.statusMessage = {
          type: 'success',
          message:
            'A password reset link has been sent to your registered email address. Please check your inbox.',
        };
      },
      (error: HttpErrorResponse) => {
        // Handling errors based on response status
        if (error.status === 500) {
          this.statusMessage = {
            type: 'error',
            message:
              'Email address not found. Please enter a valid registered email address.',
          };
        } else {
          this.statusMessage = {
            type: 'error',
            message: 'An error occurred. Please try again later.',
          };
        }
      }
    );
  }
}
