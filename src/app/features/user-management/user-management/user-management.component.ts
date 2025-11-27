import { Component } from '@angular/core';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { getPermissionIds } from '../../../core/store/auth-state/auth.selector';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [NavigationbarComponent, MatIconModule, RouterLink, NgIf],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent {
  hasPermissionToAssignPermissionsToRole: boolean = true;
  hasPermissionToViewPermision: boolean = true;

  constructor(private router: Router, private store: Store) {}
  // ngOnInit lifecycle hook to fetch and set permissions from the store
  ngOnInit() {
    this.store.select(getPermissionIds).subscribe((permissionIds) => {
      this.hasPermissionToAssignPermissionsToRole =
        permissionIds.includes('48');
      this.hasPermissionToViewPermision = permissionIds.includes('49');
    });
  }
  // Method to navigate to the permission management page
  permissionManagement() {
    this.router.navigate(['/permissonManagement']);
  }
  // Method to navigate to the assign permission to role page
  assignPermissionToRole() {
    this.router.navigate(['/assignPermissionToRole']);
  }

  // Method to navigate to the user creation page
  userCreation() {
    this.router.navigate(['/userCreation']);
  }
}
