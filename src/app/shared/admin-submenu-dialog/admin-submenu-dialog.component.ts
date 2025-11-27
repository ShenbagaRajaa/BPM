import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getPermissionIds } from '../../core/store/auth-state/auth.selector';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-submenu-dialog',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatTooltipModule],
  templateUrl: './admin-submenu-dialog.component.html',
  styleUrl: './admin-submenu-dialog.component.css',
})
export class AdminSubmenuDialogComponent {
  hasPermissionToDepartmentManagement: boolean = false;
  hasPermissionToSystemManagement: boolean = false;
  hasPermissionToSiteManagement: boolean = false;
  hasPermissionToPlanLevelManagement: boolean = false;
  hasPermissionToPlanTypeManagement: boolean = false;
  hasPermissionToRoleManagement: boolean = false;
  hasPermissionToDRSkillManagement: boolean = false;
  hasPermissionToDefaultSettings: boolean = false;
  hasPermissionToSystemTypeManagement: boolean = false;
  hasPermissionToDRTeamManagement: boolean = false;
  hasPermissionToUserManagement: boolean = false;
  // Constructor injects dependencies like MatDialogRef, Router, and Store
  constructor(
    private dialogRef: MatDialogRef<AdminSubmenuDialogComponent>,
    private router: Router,
    private store: Store
  ) {}
  // Method to close the dialog
  close(): void {
    this.dialogRef.close();
  }
  // Method to navigate to a route and close the dialog
  navigateAndClose(route: string): void {
    this.router.navigate([route]);
    this.close();
  }
  // ngOnInit lifecycle hook to dispatch actions and set permissions based on state
  ngOnInit(): void {
    // Subscribe to permission IDs from the store and set permission flags
    this.store.select(getPermissionIds).subscribe((permissionIds) => {
      this.hasPermissionToUserManagement = permissionIds.includes('20');
      this.hasPermissionToDepartmentManagement = permissionIds.includes('38');
      this.hasPermissionToSiteManagement = permissionIds.includes('37');
      this.hasPermissionToSystemManagement = permissionIds.includes('39');
      this.hasPermissionToPlanLevelManagement = permissionIds.includes('40');
      this.hasPermissionToPlanTypeManagement = permissionIds.includes('41');
      this.hasPermissionToRoleManagement = permissionIds.includes('44');
      this.hasPermissionToDRSkillManagement = permissionIds.includes('53');
      this.hasPermissionToDefaultSettings = permissionIds.includes('50');
      this.hasPermissionToSystemTypeManagement = permissionIds.includes('62');
      this.hasPermissionToDRTeamManagement = permissionIds.includes('57');
    });
  }
}
