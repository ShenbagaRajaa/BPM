import { HttpClientModule } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { role } from '../../../core/models/role.model';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { appState } from '../../../core/store/app-state/app.state';
import {
  getPermissionIds,
  selectUser,
} from '../../../core/store/auth-state/auth.selector';
import { CustomButtonComponent } from '../../../shared/custom-button/custom-button.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { StatusFilterComponent } from '../../../shared/status-filter/status-filter.component';
import { ConfirmDialogComponent } from '../../build-br-plan/confirm-dialog/confirm-dialog.component';
import {
  addRoleSuccess,
  deleteRole,
  deleteRoleSuccess,
  editRoleSuccess,
  getRoles,
} from '../../../core/store/role-state/role.action';
import { selectAllRoles } from '../../../core/store/role-state/role.selector';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';
import { ViewRoleComponent } from '../view-role/view-role.component';
import { getAllUser } from '../../../core/store/user-state/user.action';
import { selectAllUsers } from '../../../core/store/user-state/user.selector';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-of-roles',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    InputFieldComponent,
    MatGridListModule,
    MatTableModule,
    NavigationbarComponent,
    MatCardModule,
    HttpClientModule,
    AgGridAngular,
    MatButtonModule,
  ],
  providers: [DatePipe],
  templateUrl: './list-of-roles.component.html',
  styleUrl: './list-of-roles.component.css',
})
export class ListOfRolesComponent {
  filterValue = '';
  route: ActivatedRoute | null | undefined;
  isDataLoaded: boolean = false;
  departments: { id: number; departmentName: string }[] = [];
  users: addUserModel[] = [];

  ngOnChanges() {}

  rowData: role[] = [];
  originalRowData: role[] = [];
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50];
  isBRManager: boolean = false;
  roles: { id: number; roleName: string }[] = [];
  hasPermissionToDelete: boolean = false;
  hasPermissionToEdit: boolean = false;
  hasPermissionToCreate: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<appState>,
    private router: Router,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private actions$: Actions,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    // Subscribe to permission changes to update which actions are allowed
    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionIds) => {
        this.hasPermissionToCreate = permissionIds.includes('45');
        this.hasPermissionToEdit = permissionIds.includes('46');
        this.hasPermissionToDelete = permissionIds.includes('47');
        this.updateDisplayColumns();
      });

    this.getData();

    this.actions$
      .pipe(
        ofType(addRoleSuccess, editRoleSuccess, deleteRoleSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.getData();
      });
  }
  // Fetch roles and user data from the store
  getData() {
    this.store.dispatch(getRoles());
    this.store.select(selectAllRoles).subscribe((data: role[]) => {
      this.rowData = data;
      this.originalRowData = data;
    });
    this.store.dispatch(getAllUser());
    this.store.select(selectAllUsers).subscribe((data) => {
      this.users = data;
    });
  }
  // Formatter for active status to display 'Active' or 'Inactive'
  isActiveValueFormatter = (params: { value: boolean }) => {
    return params.value ? 'Active' : 'Inactive';
  };

  displayedColumns: ColDef[] = [];
  // Updates columns displayed in the ag-Grid table based on permissions
  updateDisplayColumns() {
    this.displayedColumns = [
      {
        field: 'roleName',
        headerName: 'Role Name',
        flex: 2,
        cellRenderer: (params: any) => {
          const link = document.createElement('a');
          link.href = 'javascript:void(0)';
          link.style.color = 'black';
          link.innerText = params.value;
          link.addEventListener('click', () => {
            this.ngZone.run(() => this.openRoleDetails(params.data));
          });
          return link;
        },
      },
      {
        headerName: 'Status',
        field: 'status',
        flex: 1,
        sortable: false,
        cellRenderer: (params: ValueFormatterParams<boolean>) => {
          return params.value ? 'Active' : 'Inactive';
        },
        filter: StatusFilterComponent,
      },
    ];

    if (this.hasPermissionToEdit) {
      this.displayedColumns.push({
        field: 'Action',
        sortable: false,
        cellRenderer: CustomButtonComponent,
        flex: 0.7,
        cellRendererParams: () => {
          return {
            buttonClicked: (rowData: role) => {
              this.createRole(rowData);
            },
          };
        },
      });
    }

    // Conditionally add columns for delete and edit actions based on permissions
    if (this.hasPermissionToDelete) {
      this.displayedColumns.push({
        field: 'delete',
        headerName: 'Delete',
        flex: 0.7,
        cellRenderer: (params: any) => {
          const button = document.createElement('button');
          button.innerHTML = `<i class="material-icons text-text">delete_forever</i>`;
          button.style.border = 'none';
          button.style.padding = '10px 10px';
          button.style.cursor = 'pointer';

          button.addEventListener('click', () => {
            this.ngZone.run(() => {
              this.confirmDelete(params.data.id);
            });
          });

          return button;
        },
        sortable: false,
      });
    }
  }
  // Navigate to the role creation page (either new or edit)
  createRole(event?: role) {
    if (event) {
      this.router.navigate(['../home/roleManagement/newRoleCreation'], {
        queryParams: { roleId: event.id },
      });
    } else {
      this.router.navigate([`../home/roleManagement/newRoleCreation`]);
    }
  }
  // Handle external filter changes (searching for a role)
  externalFilterChanged(newValue: string) {
    this.filterValue = newValue.toLowerCase();

    if (this.filterValue) {
      this.rowData = this.originalRowData.filter((row) => {
        return row.roleName.toLowerCase().includes(this.filterValue);
      });
    } else {
      this.rowData = [...this.originalRowData];
    }
  }

  confirmDelete(roleId: number) {
    let userId = 0;
    this.store.select(selectUser).subscribe((data) => {
      userId = data.user.id;
    });
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this role?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(deleteRole({ roleId, userId }));
      }
    });
  }

  openRoleDetails(role: role) {
    // Find users who created/last changed the department
    const createdByDetails = this.users.find(
      (user) => user.id === role.createdBy
    );
    const lastchangedByDetails = this.users.find(
      (user) => user.id === role.lastChangedBy
    );

    const createdByName = createdByDetails
      ? `${createdByDetails.employeeFirstName} ${createdByDetails.employeeLastName}`
      : 'N/A';

    const lastchangedByName = lastchangedByDetails
      ? `${lastchangedByDetails.employeeFirstName} ${lastchangedByDetails.employeeLastName}`
      : 'N/A';

    const history = {
      createdBy: `Created By: ${createdByName}`,
      createdDate: `Created Date: ${
        role.createdDate
          ? this.datePipe.transform(role.createdDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
      lastChangedBy: `Last Changed By: ${lastchangedByName}`,
      lastChangedDate: `Last Changed Date: ${
        role.lastChangedDate
          ? this.datePipe.transform(role.lastChangedDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
    };

    const status = role.status ? 'Active' : 'Inactive';

    const detailedDepartment = {
      ...role,
      status,
      history,
    };

    this.dialog.open(ViewRoleComponent, {
      width: '720px',
      data: detailedDepartment,
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
