import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { Store } from '@ngrx/store';
import { appState } from '../../../core/store/app-state/app.state';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { getRoles } from '../../../core/store/role-state/role.action';
import { selectAllRoles } from '../../../core/store/role-state/role.selector';
import { permission } from '../../../core/models/permissions.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  editPermission,
  getPermissions,
  getPermissionsByRoleId,
} from '../../../core/store/permission-state/permission.action';
import {
  selectAllPermissions,
  selectPermissionByRoleId,
} from '../../../core/store/permission-state/permission.selector';
import { permissionByRole } from '../../../core/models/permissionByRole.model';
import { showSnackBar } from '../../../core/store/snackbar-state/snackbar.action';
import { getPermissionIds } from '../../../core/store/auth-state/auth.selector';
import { Subject, takeUntil } from 'rxjs';
import { SearchableDropdownComponent } from '../../../shared/searchable-state-dropdown/searchable-dropdown.component';

interface PermissionGroup {
  name: string;
  permissions: permission[];
}

@Component({
  selector: 'app-assign-permission-to-role',
  standalone: true,
  imports: [
    NavigationbarComponent,
    NgIf,
    SearchableDropdownComponent,
    NgFor,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './assign-permission-to-role.component.html',
  styleUrls: ['./assign-permission-to-role.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AssignPermissionToRoleComponent {
  roles: { id: number; roleName: string }[] = [];
  show = false;
  permissions!: permission[];
  groupedPermissions: PermissionGroup[] = [];
  @Input() roleId: number = 0;
  selectedPermissions: boolean[] = [];
  initialPermissions: boolean[] = [];
  saveButtonDisabled: boolean = true;
  hasPermissionToViewPermision: boolean = true;
  @Output() activeValue = new EventEmitter<any>();
  @Input() child: boolean = false;
  cssStyle: string =
    'md:p-4 tablet:p-4 pb-4 h-screen flex flex-col bg-mBgBlue tablet:bg-lblue md:bg-lblue tablet:pb-12 no-scrollbar tablet: overflow-y-auto';
  private destroy$ = new Subject<void>();

  constructor(private store: Store<appState>, private router: Router) {}

  ngOnInit() {
    // Dispatch actions to fetch roles and permissions from the store
    this.store.dispatch(getRoles());
    this.store.dispatch(getPermissions());
    this.store.select(getPermissionIds).subscribe((permissionIds) => {
      this.hasPermissionToViewPermision = permissionIds.includes('49');
    });

    this.store.select(selectAllRoles).subscribe((roles) => {
      this.roles = roles.filter((role) => role.status === true);
    });

    this.store
      .select(selectAllPermissions)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionData) => {
        if (this.initialPermissions.length === 0) {
          this.permissions = permissionData;
          this.initialPermissions = new Array(permissionData.length).fill(
            false
          );
          this.selectedPermissions = new Array(permissionData.length).fill(
            false
          );
          this.groupPermissions(permissionData);
        }
      });

    if (this.child) {
      this.cssStyle = 'bg-white tablet:bg-white md:bg-white mb-3';
      this.getRole(this.roleId);
    }
  }
  // Method to group permissions based on their category
  private groupPermissions(permissions: permission[]) {
    const groupMap = new Map<string, permission[]>();

    permissions.forEach((permission) => {
      const groupName = permission.permissionName.includes('/')
        ? permission.permissionName.split('/')[0]
        : 'Other';

      if (!groupMap.has(groupName)) {
        groupMap.set(groupName, []);
      }
      groupMap.get(groupName)?.push(permission);
    });

    this.groupedPermissions = Array.from(groupMap.entries()).map(
      ([name, perms]) => ({
        name,
        permissions: perms,
      })
    );
  }
  // Method to get the index of a permission in the permissions array
  getPermissionIndex(permission: permission): number {
    return this.permissions.findIndex((p) => p.id === permission.id);
  }
  // Method to handle role selection and fetch associated permissions
  getRole(event: number) {
    this.show = true;

    if (!this.child) {
      this.roleId = event;
      this.store.dispatch(getPermissionsByRoleId({ roleId: this.roleId }));
    }

    if (this.roleId) {
      this.store
        .select(selectPermissionByRoleId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((permissionData) => {
          this.selectedPermissions = new Array(this.permissions.length).fill(
            false
          );
          this.initialPermissions = new Array(this.permissions.length).fill(
            false
          );

          permissionData.forEach((permission) => {
            const index = this.permissions.findIndex(
              (p) => p.permissionName === permission.permissionName
            );
            if (index !== -1) {
              this.selectedPermissions[index] = true;
              this.initialPermissions[index] = true;
            }
          });

          this.checkForChanges();
        });
    }
  }
  // Method to check if there are any changes in the selected permissions
  checkForChanges(): void {
    this.saveButtonDisabled =
      JSON.stringify(this.selectedPermissions) ===
      JSON.stringify(this.initialPermissions);
  }
  // Method to handle permission changes
  onPermissionChange(): void {
    this.checkForChanges();
    this.activeValue.emit(this.selectedPermissions);
  }
  // Method to save the selected permissions to the role
  savePermissions(): void {
    const selectedPermissions: string | number[] = this.permissions
      .filter((_, i) => this.selectedPermissions[i])
      .map((perm) => perm.id);

    const newPermission: permissionByRole = {
      roleId: this.roleId,
      permissionIds: selectedPermissions,
    };

    if (selectedPermissions.length === 0) {
      this.store.dispatch(
        showSnackBar({
          message: 'Please select at least one permission',
          status: 'error',
        })
      );
    } else {
      this.store.dispatch(editPermission({ editPermission: newPermission }));
    }
  }
  // Method to navigate back to the previous page
  back() {
    this.router.navigate([`../home/userManagement`]);
  }
  // Method to navigate to permission management
  permissionManagement() {
    this.router.navigate(['../home/userManagement/permissionManagement']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
