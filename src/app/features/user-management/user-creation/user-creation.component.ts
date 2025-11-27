import { Component, NgZone } from '@angular/core';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { appState } from '../../../core/store/app-state/app.state';
import {
  clearUser,
  deleteUser,
  deleteUserSuccess,
  getAllUser,
  unlockUserAccount,
  unlockUserAccountSuccess,
  updateUserSuccess,
} from '../../../core/store/user-state/user.action';
import { selectAllUsers } from '../../../core/store/user-state/user.selector';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { StatusFilterComponent } from '../../../shared/status-filter/status-filter.component';
import { RoleFilterComponent } from '../../../shared/role-filter/role-filter.component';
import { getPermissionIds } from '../../../core/store/auth-state/auth.selector';
import { Subject, takeUntil } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { ConfirmDialogComponent } from '../../build-br-plan/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { loadCountry } from '../../../core/store/country-state/country.action';

@Component({
  selector: 'app-user-creation',
  standalone: true,
  imports: [
    NavigationbarComponent,
    InputFieldComponent,
    AgGridAngular,
    MatMenuModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './user-creation.component.html',
  styleUrl: './user-creation.component.css',
})
export class UserCreationComponent {
  filterValue = '';
  route: ActivatedRoute | null | undefined;

  rowData: addUserModel[] = [];
  originalRowData: addUserModel[] = [];
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50];
  hasPermissionToDelete: boolean = false;
  hasPermissionToEdit: boolean = false;
  hasPermissionToCreate: boolean = false;
  hasPermissionToUnlock: boolean = false;
  private destroy$ = new Subject<void>();
  // Constructor: Dependency Injection for Store, Router, NgZone, and other services
  constructor(
    private store: Store<appState>,
    private router: Router,
    private ngZone: NgZone,
    private actions$: Actions,
    private dialog: MatDialog
  ) {}
  // Lifecycle hook: Initializes data retrieval and listens to successful actions
  ngOnInit() {
    this.getData();

    this.actions$
      .pipe(
        ofType(updateUserSuccess, deleteUserSuccess, unlockUserAccountSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(getAllUser());
      });
  }
  // Lifecycle hook: Handles changes in component inputs (if necessary)
  ngOnChanges() {
    this.getData();
  }
  // Function to fetch user data and permissions, updating grid columns based on permissions
  getData() {
    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionIds) => {
        this.hasPermissionToCreate = permissionIds.includes('17');
        this.hasPermissionToEdit = permissionIds.includes('18');
        this.hasPermissionToDelete = permissionIds.includes('19');
        this.hasPermissionToUnlock = permissionIds.includes('71');
        this.updateColumnDefinitions();
      });
    this.store.dispatch(getAllUser());
    this.store.dispatch(loadCountry());
    this.store.select(selectAllUsers).subscribe((data: addUserModel[]) => {
      this.rowData = data;
      this.originalRowData = data;
    });
  }
  // Function to view a user's details by navigating to the specific user page
  viewUser(rowData: addUserModel) {
    this.router.navigate(['../home/userManagement/viewUser', rowData.email]);
  }
  // Value formatter to display 'Active' or 'Inactive' based on boolean value
  isActiveValueFormatter = (params: { value: boolean }) => {
    return params.value ? 'Active' : 'Inactive';
  };
  // Array of column definitions for ag-Grid
  displayedColumns: ColDef[] = [];
  // Function to update column definitions based on permissions
  updateColumnDefinitions() {
    this.displayedColumns = [
      {
        headerName: 'Employee Name',
        field: 'employeeFirstName',
        flex: 2,
        cellRenderer: (params: any) => {
          const link = document.createElement('a');
          link.href = 'javascript:void(0)';
          link.style.color = 'black';
          link.innerText = `${params.data.employeeFirstName} ${params.data.employeeLastName}`;
          link.addEventListener('click', () => {
            this.ngZone.run(() => this.viewUser(params.data));
          });
          return link;
        },
      },
      { field: 'email', flex: 2 },
      {
        field: 'role',
        flex: 1,
        filter: RoleFilterComponent,
      },
      {
        headerName: 'Status',
        field: 'isActive',
        flex: 1,
        cellRenderer: (params: any) => {
          if (params.data.accountLocked === true) {
            return 'Locked';
          }
          return params.value ? 'Active' : 'Inactive';
        },
        filter: StatusFilterComponent,
      },
    ];

    // Add single unified 'Action' column if user has any relevant permission
    if (
      this.hasPermissionToUnlock ||
      (this.hasPermissionToEdit && this.hasPermissionToCreate) ||
      this.hasPermissionToDelete
    ) {
      this.displayedColumns.push({
        field: 'Action',
        headerName: 'Action',
        flex: 1,
        cellRenderer: (params: any) => {
          const actionContainer = document.createElement('div');
          actionContainer.style.display = 'flex';
          actionContainer.style.gap = '6px';
          // actionContainer.style.justifyContent = 'center';
          // actionContainer.style.alignItems = 'center';

          // Common style helper
          const createButton = (icon: string, color: string = '#3a3a81') => {
            const btn = document.createElement('button');
            btn.innerHTML = `<i class="material-icons text-white" >${icon}</i>`;
            btn.style.backgroundColor = color;
            btn.style.color = '#ffffff';
            btn.style.border = 'none';
            btn.style.padding = '5px';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            btn.style.boxShadow =
              '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.width = '30px';
            btn.style.height = '30px';
            btn.style.marginTop = '6px';
            return btn;
          };

          // ===== Unlock Button =====
          if (
            this.hasPermissionToUnlock &&
            params.data.accountLocked === true
          ) {
            const unlockBtn = createButton('lock_open', '#c62828');
            unlockBtn.title = 'Unlock User';
            unlockBtn.addEventListener('click', () => {
              this.ngZone.run(() => {
                this.confirmUnlock(params.data.email);
              });
            });
            actionContainer.appendChild(unlockBtn);
          }

          // ===== Edit Button =====
          if (this.hasPermissionToEdit && this.hasPermissionToCreate) {
            const editBtn = createButton('edit');
            editBtn.title = 'Edit User';
            editBtn.addEventListener('click', () => {
              this.ngZone.run(() => {
                this.createUser(params.data);
              });
            });
            actionContainer.appendChild(editBtn);
          }

          // ===== Delete Button =====
          if (this.hasPermissionToDelete) {
            const deleteBtn = createButton('delete_forever'); // red delete button
            deleteBtn.title = 'Delete User';
            deleteBtn.addEventListener('click', () => {
              this.ngZone.run(() => {
                this.confirmDelete(params.data.id);
              });
            });
            actionContainer.appendChild(deleteBtn);
          }

          // If no buttons, return null
          return actionContainer.childNodes.length ? actionContainer : null;
        },
        sortable: false,
      });
    }
  }
  // Opens confirmation dialog before deleting a user
  confirmDelete(userId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this User?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(deleteUser({ userId }));
      }
    });
  }

  confirmUnlock(email: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Unlock User Account',
        message: 'Are you sure you want to unlock this User Account?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(unlockUserAccount({ email }));
      }
    });
  }
  // Navigates to the user creation page (with or without user data)
  createUser(event?: addUserModel) {
    if (event) {
      this.router.navigate([
        `../home/userManagement/createNewUser/`,
        event.email,
        false,
      ]);
    } else {
      this.router.navigate([`../home/userManagement/createNewUser`]);
    }
  }
  // External filter function to search through the user data
  externalFilterChanged(newValue: string) {
    this.filterValue = newValue;

    if (this.filterValue) {
      this.rowData = this.originalRowData.filter(
        (row) =>
          row.employeeFirstName
            .toLowerCase()
            .includes(this.filterValue.toLowerCase()) ||
          row.employeeLastName
            ?.toLowerCase()
            .includes(this.filterValue.toLowerCase()) ||
          row.email.toLowerCase().includes(this.filterValue)
      );
    } else {
      this.rowData = [...this.originalRowData];
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(clearUser());
  }
}
