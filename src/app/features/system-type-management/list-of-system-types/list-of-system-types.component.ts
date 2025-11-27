import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { takeUntil, Subject } from 'rxjs';
import { systemType } from '../../../core/models/systemType.model';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { appState } from '../../../core/store/app-state/app.state';
import {
  getPermissionIds,
  selectUser,
} from '../../../core/store/auth-state/auth.selector';
import { CustomButtonComponent } from '../../../shared/custom-button/custom-button.component';
import { StatusFilterComponent } from '../../../shared/status-filter/status-filter.component';
import { ConfirmDialogComponent } from '../../build-br-plan/confirm-dialog/confirm-dialog.component';
import {
  addSystemTypeSuccess,
  deleteSystemType,
  deleteSystemTypeSuccess,
  editSystemTypeSuccess,
  getSystemTypes,
} from '../../../core/store/system-type-state/system-type.action';
import { selectAllSystemTypes } from '../../../core/store/system-type-state/system-type.selector';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AgGridAngular } from 'ag-grid-angular';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { MatMenuModule } from '@angular/material/menu';
import { ViewSystemTypeComponent } from '../view-system-type/view-system-type.component';
import { CommonModule, DatePipe } from '@angular/common';
import { selectAllUsers } from '../../../core/store/user-state/user.selector';

@Component({
  selector: 'app-list-of-system-types',
  standalone: true,
  imports: [
    MatIconModule,
    MatMenuModule,
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
  templateUrl: './list-of-system-types.component.html',
  styleUrl: './list-of-system-types.component.css',
})
export class ListOfSystemTypesComponent {
  filterValue = '';
  route: ActivatedRoute | null | undefined;
  isDataLoaded: boolean = false;
  departments: { id: number; departmentName: string }[] = [];
  users: addUserModel[] = [];
  private destroy$ = new Subject<void>();

  rowData: systemType[] = [];
  originalRowData: systemType[] = [];
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50];
  isBRManager: boolean = false;
  systemTypes: { id: number; systemTypeName: string }[] = [];
  hasPermissionToDelete: boolean = false;
  hasPermissionToEdit: boolean = false;
  hasPermissionToCreate: boolean = false;

  constructor(
    private store: Store<appState>,
    private router: Router,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private actions$: Actions,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Get permissions for the current user from the store
    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionIds) => {
        this.hasPermissionToCreate = permissionIds.includes('63');
        this.hasPermissionToEdit = permissionIds.includes('64');
        this.hasPermissionToDelete = permissionIds.includes('65');
        this.updateColumnDefinitions();
      });

    this.getData();

    this.actions$
      .pipe(
        ofType(
          addSystemTypeSuccess,
          editSystemTypeSuccess,
          deleteSystemTypeSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.getData();
      });

    this.cdr.detectChanges();
  }
  ngOnChanges() {}

  getData() {
    // Dispatch action to load system types
    this.store.dispatch(getSystemTypes());
    this.store.select(selectAllSystemTypes).subscribe((data: systemType[]) => {
      this.rowData = data;
      this.originalRowData = data;
    });

    this.store.select(selectAllUsers).subscribe((data) => {
      this.users = data;
    });
  }

  isActiveValueFormatter = (params: { value: boolean }) => {
    return params.value ? 'Active' : 'Inactive';
  };

  displayedColumns: ColDef[] = [];
  // Update column definitions based on user permissions
  updateColumnDefinitions() {
    this.displayedColumns = [
      {
        field: 'systemTypeName',
        headerName: 'System Type Name',
        flex: 2,
        cellRenderer: (params: any) => {
          const link = document.createElement('a');
          link.href = 'javascript:void(0)';
          link.style.color = 'black';
          link.innerText = params.value;
          link.addEventListener('click', () => {
            this.ngZone.run(() => this.openSystemTypeDetails(params.data));
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
    // Add delete column if the user has permission to delete
    if (this.hasPermissionToDelete) {
      this.displayedColumns.push({
        field: 'delete',
        headerName: 'Delete',
        flex: 0.7,
        cellRenderer: (params: any) => {
          const button = document.createElement('button');
          button.innerHTML = `<i class="material-icons text-text">delete_forever</i>`;
          button.style.border = 'none';
          button.style.padding = '5px 10px';
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
    // Add edit column if the user has permission to edit
    if (this.hasPermissionToEdit) {
      this.displayedColumns.push({
        field: 'Action',
        sortable: false,
        cellRenderer: CustomButtonComponent,
        flex: 1,
        cellRendererParams: () => {
          return {
            buttonClicked: (rowData: systemType) => {
              this.createSystemType(rowData);
            },
          };
        },
      });
    }
  }

  createSystemType(event?: systemType) {
    // Navigate to the creation/edit form with system type ID if provided
    if (event) {
      this.router.navigate(
        ['../home/systemTypeManagement/newSystemTypeCreation'],
        {
          queryParams: { systemTypeId: event.id },
        }
      );
    } else {
      this.router.navigate([
        `../home/systemTypeManagement/newSystemTypeCreation`,
      ]);
    }
  }

  externalFilterChanged(newValue: string) {
    this.filterValue = newValue.toLowerCase();

    if (this.filterValue) {
      this.rowData = this.originalRowData.filter((row) => {
        return row.systemTypeName.toLowerCase().includes(this.filterValue);
      });
    } else {
      this.rowData = [...this.originalRowData];
    }
  }

  confirmDelete(systemTypeId: number) {
    let userId = 0;
    this.store.select(selectUser).subscribe((data) => {
      userId = data.user.id;
    });
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this systemType?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(deleteSystemType({ systemTypeId, userId }));
      }
    });
  }
  openSystemTypeDetails(systemTypeData: systemType) {
    const createdByDetails = this.users.find(
      (user) => user.id === systemTypeData.createdBy
    );
    const lastChangedByDetails = this.users.find(
      (user) => user.id === systemTypeData.lastChangedBy
    );

    const createdByName =
      createdByDetails?.employeeFirstName +
        ' ' +
        createdByDetails?.employeeLastName || 'Unknown';
    const lastchangedByName =
      lastChangedByDetails?.employeeFirstName +
        ' ' +
        lastChangedByDetails?.employeeLastName || 'Unknown';

    const history = {
      createdBy: `Created By: ${createdByName || 'Unknown'}`,
      createdDate: `Created Date: ${
        systemTypeData.createdDate
          ? this.datePipe.transform(systemTypeData.createdDate, 'yyyy-MM-dd') // Format as needed
          : 'Unknown'
      }`,
      lastChangedBy: `Last Changed By: ${lastchangedByName || 'Unknown'}`,
      lastChangedDate: `Last Changed Date: ${
        systemTypeData.lastChangedDate
          ? this.datePipe.transform(
              systemTypeData.lastChangedDate,
              'yyyy-MM-dd'
            ) // Format as needed
          : 'Unknown'
      }`,
    };

    const status = systemTypeData.status ? 'Active' : 'Inactive';
    const detailedDRTeam = {
      ...systemTypeData,
      status: status,
      history: history,
    };

    this.dialog.open(ViewSystemTypeComponent, {
      width: '720px',
      data: detailedDRTeam,
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
