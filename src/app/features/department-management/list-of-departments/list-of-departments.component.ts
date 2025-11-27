import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { appState } from '../../../core/store/app-state/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { AgGridAngular } from 'ag-grid-angular';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';

import { department } from '../../../core/models/department.model';
import { selectAllDepartments } from '../../../core/store/department-state/department.selector';
import {
  deleteDepartment,
  getDepartments,
} from '../../../core/store/department-state/department.action';
import { MatDialog } from '@angular/material/dialog';
import { ViewDepartmentComponent } from '../view-department/view-department.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmDialogComponent } from '../../build-br-plan/confirm-dialog/confirm-dialog.component';
import {
  getPermissionIds,
  selectUser,
} from '../../../core/store/auth-state/auth.selector';
import { CustomButtonComponent } from '../../../shared/custom-button/custom-button.component';
import { StatusFilterComponent } from '../../../shared/status-filter/status-filter.component';
import { selectAllUsers } from '../../../core/store/user-state/user.selector';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { getAllUser } from '../../../core/store/user-state/user.action';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-of-departments',
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
    CommonModule,
  ],
  providers: [DatePipe],
  templateUrl: './list-of-departments.component.html',
  styleUrl: './list-of-departments.component.css',
})
export class ListOfDepartmentsComponent {
  filterValue = '';
  route: ActivatedRoute | null | undefined;
  isDataLoaded: boolean = false;
  rowData: department[] = [];
  users: addUserModel[] = [];
  originalRowData: department[] = [];
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50];
  isBRManager: boolean = false;
  hasPermissionToDelete: boolean = false;
  hasPermissionToEdit: boolean = false;
  hasPermissionToCreate: boolean = false;
  isBrowser: boolean;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<appState>,
    private router: Router,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    // Check if the application is running in a browser environment
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Fetch permissions and update the UI accordingly
    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionIds) => {
        this.hasPermissionToCreate = permissionIds.includes('25');
        this.hasPermissionToEdit = permissionIds.includes('26');
        this.hasPermissionToDelete = permissionIds.includes('27');
        if (this.isBrowser) this.updateDisplayColumns();
      });
    this.getData();
    this.cdr.detectChanges();
  }

  getData() {
    this.store.dispatch(getAllUser());
    this.store.dispatch(getDepartments());
    this.store.select(selectAllUsers).subscribe((data) => (this.users = data));
    this.store.select(selectAllDepartments).subscribe((data: department[]) => {
      this.rowData = this.mapSiteNamesToDepartments(data);
      this.originalRowData = this.mapSiteNamesToDepartments(data);
    });

    this.cdr.detectChanges();
  }

  isActiveValueFormatter = (params: { value: boolean }) => {
    return params.value ? 'Active' : 'Inactive';
  };

  displayedColumns: ColDef[] = [];

  updateDisplayColumns() {
    this.displayedColumns = [
      {
        field: 'departmentName',
        headerName: 'Department Name',
        flex: 2,
        cellRenderer: (params: any) => {
          const link = document.createElement('a');
          link.href = 'javascript:void(0)';
          link.style.color = 'black';
          link.innerText = params.value;
          link.addEventListener('click', () => {
            this.ngZone.run(() => this.openDepartmentDetails(params.data));
          });
          return link;
        },
      },
      {
        field: 'departmentCode',
        headerName: 'Department Code',
        sortable: false,
        flex: 1,
      },
      {
        headerName: 'Status',
        field: 'status',
        flex: 1,
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
            buttonClicked: (rowData: department) => {
              this.createDepartment(rowData);
            },
          };
        },
      });
    }

    if (this.hasPermissionToDelete) {
      this.displayedColumns.push({
        field: 'delete',
        headerName: 'Delete',
        sortable: false,
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
      });
    }
  }

  mapSiteNamesToDepartments(departments: department[]): department[] {
    return departments.map((department) => {
      return {
        ...department,
      };
    });
  }

  createDepartment(event?: department) {
    if (event) {
      this.router.navigate(
        ['../home/departmentManagement/newDepartmentCreation'],
        {
          queryParams: { departmentId: event.id },
        }
      );
    } else {
      this.router.navigate([
        `../home/departmentManagement/newDepartmentCreation`,
      ]);
    }
  }

  externalFilterChanged(newValue: string) {
    this.filterValue = newValue;

    if (this.filterValue) {
      this.rowData = this.originalRowData.filter(
        (row) =>
          row.departmentName.toLowerCase().includes(this.filterValue) ||
          row.departmentCode.toLowerCase().includes(this.filterValue)
      );
    } else {
      this.rowData = [...this.originalRowData];
    }
  }

  openDepartmentDetails(department: department) {
    // Find users who created/last changed the department
    const createdByDetails = this.users.find(
      (user) => user.id === department.createdBy
    );
    const lastchangedByDetails = this.users.find(
      (user) => user.id === department.lastChangedBy
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
        department.createdDate
          ? this.datePipe.transform(department.createdDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
      lastChangedBy: `Last Changed By: ${lastchangedByName}`,
      lastChangedDate: `Last Changed Date: ${
        department.lastChangedDate
          ? this.datePipe.transform(department.lastChangedDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
    };

    const status = department.status ? 'Active' : 'Inactive';

    const detailedDepartment = {
      ...department,
      status,
      history,
    };

    this.dialog.open(ViewDepartmentComponent, {
      width: '720px',
      data: detailedDepartment,
    });
  }

  confirmDelete(departmentId: number) {
    // Show confirmation dialog before deleting a department
    let userId = 0;
    this.store.select(selectUser).subscribe((data) => {
      userId = data.user.id;
    });
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this Department?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(deleteDepartment({ departmentId, userId }));
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
