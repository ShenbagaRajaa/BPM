import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ColDef, ValueFormatterParams, GridApi } from 'ag-grid-community';
import { planType } from '../../../core/models/planType.model';
import { appState } from '../../../core/store/app-state/app.state';
import { StatusFilterComponent } from '../../../shared/status-filter/status-filter.component';
import { ViewPlanTypeComponent } from '../view-plan-type/view-plan-type.component';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { AgGridAngular } from 'ag-grid-angular';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import {
  getPermissionIds,
  selectUser,
} from '../../../core/store/auth-state/auth.selector';
import { ConfirmDialogComponent } from '../../build-br-plan/confirm-dialog/confirm-dialog.component';
import {
  addPlanTypeSuccess,
  deletePlanType,
  deletePlanTypeSuccess,
  editPlanTypeSuccess,
  getPlanTypes,
} from '../../../core/store/plan-type-state/plan-type.action';
import { CustomButtonComponent } from '../../../shared/custom-button/custom-button.component';
import { selectAllPlanTypes } from '../../../core/store/plan-type-state/plan-type.selector';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { selectAllUsers } from '../../../core/store/user-state/user.selector';
import { Subject, takeUntil } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { getAllUser } from '../../../core/store/user-state/user.action';

@Component({
  selector: 'app-list-plan-type',
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
    CommonModule,
    MatButtonModule,
  ],
  providers: [DatePipe],
  templateUrl: './list-plan-type.component.html',
  styleUrl: './list-plan-type.component.css',
})
export class ListPlanTypeComponent {
  filterValue = '';
  route: ActivatedRoute | null | undefined;
  isDataLoaded: boolean = false;
  departments: { id: number; departmentName: string }[] = [];
  private destroy$ = new Subject<void>();

  ngOnChanges() {}
  private gridApi!: GridApi<planType>;

  rowData: planType[] = [];
  originalRowData: planType[] = [];
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50];
  isBRManager: boolean = false;
  planTypes: { id: number; planTypeName: string }[] = [];
  users!: addUserModel[];
  hasPermissionToDelete: boolean = false;
  hasPermissionToEdit: boolean = false;
  hasPermissionToCreate: boolean = false;

  constructor(
    private store: Store<appState>,
    private router: Router,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private actions$: Actions,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Fetch user permissions on component initialization
    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionIds) => {
        this.hasPermissionToCreate = permissionIds.includes('34');
        this.hasPermissionToEdit = permissionIds.includes('35');
        this.hasPermissionToDelete = permissionIds.includes('36');
        this.updateDisplayColumns();
        this.cdr.detectChanges();
      });
    this.getData();
    // Subscribe to successful actions like add, edit, delete, and reload data after each action
    this.actions$
      .pipe(
        ofType(addPlanTypeSuccess, editPlanTypeSuccess, deletePlanTypeSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.getData();
      });
  }
  // Fetch data related to plan types and users
  getData() {
    this.store.dispatch(getPlanTypes());
    this.store.dispatch(getAllUser());
    this.store.select(selectAllUsers).subscribe((data) => (this.users = data));

    this.store.select(selectAllPlanTypes).subscribe((data: planType[]) => {
      this.rowData = data;
      this.originalRowData = data;
    });
  }

  // View details of a selected plan type
  viewPlanTypeDetails(planType: planType) {
    this.openPlanTypeDetails(planType);
  }
  // Formatter for displaying 'Active' or 'Inactive' status
  isActiveValueFormatter = (params: { value: boolean }) => {
    return params.value ? 'Active' : 'Inactive';
  };

  displayedColumns: ColDef[] = [];

  updateDisplayColumns() {
    // Update columns based on permissions
    this.displayedColumns = [
      {
        field: 'planTypeName',
        headerName: 'Plan Type Name',
        flex: 2,
        cellRenderer: (params: any) => {
          const link = document.createElement('a');
          link.href = 'javascript:void(0)';
          link.style.color = 'black';
          link.innerText = params.value;
          link.addEventListener('click', () => {
            this.ngZone.run(() => this.openPlanTypeDetails(params.data));
          });
          return link;
        },
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
            buttonClicked: (rowData: planType) => {
              this.createPlanType(rowData);
            },
          };
        },
      });
    }

    // Add action column for editing plan types if the user has permission
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
  // Navigate to the plan type creation or edit page
  createPlanType(event?: planType) {
    if (event) {
      this.router.navigate(['../home/planTypeManagement/newPlanTypeCreation'], {
        queryParams: { planTypeId: event.id },
      });
    } else {
      this.router.navigate([`../home/planTypeManagement/newPlanTypeCreation`]);
    }
  }
  // External filter for searching plan types by name
  externalFilterChanged(newValue: string) {
    this.filterValue = newValue.toLowerCase();

    if (this.filterValue) {
      this.rowData = this.originalRowData.filter((row) => {
        return row.planTypeName.toLowerCase().includes(this.filterValue);
      });
    } else {
      this.rowData = [...this.originalRowData];
    }
  }

  openPlanTypeDetails(planType: planType) {
    // Find users who created/last changed the department
    const createdByDetails = this.users.find(
      (user) => user.id === planType.createdBy
    );
    const lastchangedByDetails = this.users.find(
      (user) => user.id === planType.lastChangedBy
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
        planType.createdDate
          ? this.datePipe.transform(planType.createdDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
      lastChangedBy: `Last Changed By: ${lastchangedByName}`,
      lastChangedDate: `Last Changed Date: ${
        planType.lastChangedDate
          ? this.datePipe.transform(planType.lastChangedDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
    };

    const status = planType.status ? 'Active' : 'Inactive';

    const detailedDepartment = {
      ...planType,
      status,
      history,
    };

    this.dialog.open(ViewPlanTypeComponent, {
      width: '720px',
      data: detailedDepartment,
    });
  }

  // Open confirmation dialog for deleting a plan type
  confirmDelete(planTypeId: number) {
    let userId = 0;
    this.store.select(selectUser).subscribe((data) => {
      userId = data.user.id;
    });
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this Plan Type?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(deletePlanType({ planTypeId, userId }));
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
