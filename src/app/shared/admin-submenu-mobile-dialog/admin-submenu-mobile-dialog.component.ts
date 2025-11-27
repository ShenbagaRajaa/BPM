import { Component } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getPermissionIds } from '../../core/store/auth-state/auth.selector';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-submenu-mobile-dialog',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatTooltipModule, MatDialogContent],
  templateUrl: './admin-submenu-mobile-dialog.component.html',
  styleUrl: './admin-submenu-mobile-dialog.component.css',
})
export class AdminSubmenuMobileDialogComponent {
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

  constructor(
    private dialogRef: MatDialogRef<AdminSubmenuMobileDialogComponent>,
    private router: Router,
    private store: Store
  ) {}
  // On component initialization, dispatch actions to load data and permissions
  ngOnInit(): void {
    // Select permission IDs and update the component's permission variables
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
  // Method to close the dialog
  close(): void {
    this.dialogRef.close();
  }
  // Method to navigate to a specific route and close the dialog
  navigateAndClose(route: string): void {
    this.router.navigate([route]);
    this.close();
  }
}
