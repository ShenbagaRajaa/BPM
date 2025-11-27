import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { Subscription } from 'rxjs';
import { getUserByEmail } from '../../../core/store/user-state/user.action';
import { selectUserByEmail } from '../../../core/store/user-state/user.selector';
import { environment } from '../../../../environment/environment';
import { Title } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    NgIf,
    NavigationbarComponent,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatDividerModule,
  ],
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewUserComponent implements OnInit, OnDestroy {
  employeeName: string | null = null;
  apiUrl = environment.apiUrl + '/';
  pageTitle: string = '';
  editButton: string = '';
  userDetails!: addUserModel;
  employeeEmail: string = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private titleService: Title,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setPageTitle();

    this.route.paramMap.subscribe((params) => {
      this.employeeEmail = params.get('email') ?? '';
      if (this.employeeEmail) {
        this.getUser();
      }
    });

    this.initializeUserSubscription();
  }

  private initializeUserSubscription(): void {
    // Subscribe to route params
    const routeSub = this.route.paramMap.subscribe((params) => {
      this.employeeEmail = params.get('email') ?? '';
      if (this.employeeEmail) {
        this.getUser();
      }
    });
    this.subscriptions.push(routeSub);

    // Subscribe to user details with real-time updates
    const userSub = this.store
      .select(selectUserByEmail)
      .subscribe((foundUser: addUserModel) => {
        if (foundUser) {
          // Add timestamp to force image refresh when photo path changes
          if (foundUser.uploadPhotoPath) {
            foundUser = {
              ...foundUser,
              uploadPhotoPath: `${
                foundUser.uploadPhotoPath
              }?t=${new Date().getTime()}`,
            };
          }
          this.userDetails = foundUser;
        }
      });
    this.subscriptions.push(userSub);
  }

  getUser(): void {
    this.store.dispatch(getUserByEmail({ email: this.employeeEmail }));
    this.store
      .select(selectUserByEmail)
      .subscribe((foundUser: addUserModel) => {
        this.userDetails = foundUser;
      });
  }

  get employeeInitial(): string {
    return this.userDetails?.employeeFirstName?.charAt(0).toUpperCase() || '?';
  }

  get profilePhotoUrl(): string {
    if (this.userDetails?.uploadPhotoPath) {
      return `${this.apiUrl}${this.userDetails.uploadPhotoPath}`;
    }
    return '';
  }

  setPageTitle(): void {
    const fullUrl = this.router.url;
    if (fullUrl?.includes('userManagement')) {
      this.pageTitle = 'View User';
      this.editButton = 'Edit User';
      this.titleService.setTitle('View User');
    } else {
      this.pageTitle = 'Profile';
      this.editButton = 'Edit Profile';
      this.titleService.setTitle('Profile');
    }
  }

  navigateToEditUser(): void {
    this.router.navigate([
      `../home/userManagement/createNewUser/` + this.employeeEmail,
      true,
    ]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub?.unsubscribe());
  }
}
