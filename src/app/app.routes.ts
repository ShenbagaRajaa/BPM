import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { ForgotpasswordComponent } from './features/forgot-password/forgotpassword/forgotpassword.component';
import { PasswordResetComponent } from './features/forgot-password/password-reset/password-reset.component';
import { FirstTimeResetPasswordComponent } from './features/forgot-password/first-time-reset-password/first-time-reset-password.component';
import { PrivacyPolicyComponent } from './features/forgot-password/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotpasswordComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  { path: 'first-reset', component: FirstTimeResetPasswordComponent },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/initial/initial.module').then((m) => m.InitialModule),
  },
];
