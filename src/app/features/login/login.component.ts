import {
  Component,
  OnInit,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { login, loginSuccess } from '../../core/store/auth-state/auth.action';
import {
  getPermissionIds,
  selectUser,
} from '../../core/store/auth-state/auth.selector';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Subject, take, takeUntil } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  userName: string = '';
  passWord: string = '';
  private destroy$ = new Subject<void>();
  currentYear: number = new Date().getFullYear();
  version: string = environment.version || '1.0.0';

  constructor(
    private router: Router,
    private store: Store,
    private ser: AuthService,
    private actions$: Actions
  ) {}
  ngOnInit() {
    // Listen for loginSuccess action to navigate based on permissions
    // this.actions$
    //   .pipe(ofType(loginSuccess), takeUntil(this.destroy$))
    //   .subscribe(() => {
    //     this.store
    //       .select(selectUser)
    //       .pipe(take(1))
    //       .subscribe((res) => {
    //         this.ser.setToken(res.token);
    //         this.ser.setEmail(res.user.email);

    //         if (res.user.isPasswordSetByUser) {
    //           this.store.select(getPermissionIds).subscribe((ids) => {
    //             const SESSION_FLAG = 'tabAlive';
    //             sessionStorage.setItem(SESSION_FLAG, 'true');
    //           });
    //         } else if (
    //           !res.user.isPasswordSetByUser &&
    //           res.user.isPasswordSetByUser !== undefined
    //         ) {
    //           this.router.navigate(['first-reset']);
    //         } else {
    //           this.router.navigate(['']);
    //         }
    //       });
    //   });
  }
  // ViewChild references for accessing form fields
  @ViewChild('email') emailField!: NgModel;
  @ViewChild('password') passwordField!: NgModel;
  // Login method that dispatches the login action if inputs are valid
  login() {
    if (!this.userName || this.emailField.invalid) {
      this.emailField.control.markAsTouched();
      return;
    }
    if (!this.passWord || this.passwordField.invalid) {
      this.passwordField.control.markAsTouched();
      return;
    }

    this.store.dispatch(
      login({ userName: this.userName, passWord: this.passWord })
    );
  }
  // Signal to toggle password visibility
  hide = signal(true);
  // Method to toggle password visibility
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  // Method to check if the password is hidden
  isPasswordHidden(): boolean {
    return this.hide();
  }
  // Method to navigate to the forgot-password page
  isLinkclicked() {
    this.router.navigate(['/forgot-password']);
  }
  // Observable cleanup for unsubscribing on component destroy
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
