import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ViewSystemComponent } from '../view-system/view-system.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { appState } from '../../../core/store/app-state/app.state';
import { selectAllSystems } from '../../../core/store/system-state/system.selector';
import {
  deleteSystem,
  getSystems,
} from '../../../core/store/system-state/system.action';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { AgGridAngular } from 'ag-grid-angular';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { system } from '../../../core/models/system.model';
import { CustomButtonComponent } from '../../../shared/custom-button/custom-button.component';
import {
  getPermissionIds,
  selectUser,
} from '../../../core/store/auth-state/auth.selector';
import { ConfirmDialogComponent } from '../../build-br-plan/confirm-dialog/confirm-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { StatusFilterComponent } from '../../../shared/status-filter/status-filter.component';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { selectAllUsers } from '../../../core/store/user-state/user.selector';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-of-systems',
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
  templateUrl: './list-of-systems.component.html',
  styleUrl: './list-of-systems.component.css',
})
export class ListOfSystemsComponent {
  filterValue = '';
  route: ActivatedRoute | null | undefined;
  isDataLoaded: boolean = false;
  departments: { id: number; departmentName: string }[] = [];
  users: addUserModel[] = [];
  rowData: system[] = [];
  originalRowData: system[] = [];
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50];
  isBRManager: boolean = false;
  systems: { id: number; systemName: string }[] = [];
  hasPermissionToDelete: boolean = true;
  hasPermissionToEdit: boolean = true;
  hasPermissionToCreate: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<appState>,
    private router: Router,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Load permissions and update column definitions based on permissions
    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionIds) => {
        this.hasPermissionToCreate = permissionIds.includes('28');
        this.hasPermissionToEdit = permissionIds.includes('29');
        this.hasPermissionToDelete = permissionIds.includes('30');
        this.updateColumnDefinitions();
      });

    this.store.dispatch(getSystems());

    this.store.select(selectAllUsers).subscribe((data) => (this.users = data));
    this.store.select(selectAllSystems).subscribe((data: system[]) => {
      this.rowData = this.mapDepartementNamesToSystems(data);
      this.originalRowData = this.mapDepartementNamesToSystems(data);
    });

    this.cdr.detectChanges();
  }
  // Format the status column as 'Active' or 'Inactive'
  isActiveValueFormatter = (params: { value: boolean }) => {
    return params.value ? 'Active' : 'Inactive';
  };

  displayedColumns: ColDef[] = [];

  updateColumnDefinitions() {
    this.displayedColumns = [
      {
        field: 'systemName',
        headerName: 'System Name',
        flex: 2,
        cellRenderer: (params: any) => {
          const link = document.createElement('a');
          link.href = 'javascript:void(0)';
          link.style.color = 'black';
          link.innerText = params.value;
          link.addEventListener('click', () => {
            this.ngZone.run(() => this.openSystemDetails(params.data));
          });
          return link;
        },
      },
      {
        field: 'systemCode',
        headerName: 'System Code',
        flex: 1,
        sortable: false,
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

    // Add 'Action' column if the user has permission to edit
    if (this.hasPermissionToEdit) {
      this.displayedColumns.push({
        field: 'Action',
        sortable: false,
        cellRenderer: CustomButtonComponent,
        flex: 0.7,
        cellRendererParams: () => {
          return {
            buttonClicked: (rowData: system) => {
              this.createSystem(rowData);
            },
          };
        },
      });
    }

    // Add 'Delete' column if the user has permission to delete
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
  // Map department names to systems
  mapDepartementNamesToSystems(systems: system[]): system[] {
    return systems.map((system) => {
      return {
        ...system,
      };
    });
  }
  // Navigate to system creation or edit page
  createSystem(event?: system) {
    if (event) {
      this.router.navigate(['../home/systemManagement/newSystemCreation'], {
        queryParams: { systemId: event.id },
      });
    } else {
      this.router.navigate([`../home/systemManagement/newSystemCreation`]);
    }
  }
  // Filter systems based on the search value
  externalFilterChanged(newValue: string) {
    this.filterValue = newValue.toLowerCase();

    if (this.filterValue) {
      this.rowData = this.originalRowData.filter((row) => {
        return (
          row.systemName.toLowerCase().includes(this.filterValue) ||
          row.systemCode.toLowerCase().includes(this.filterValue)
        );
      });
    } else {
      this.rowData = [...this.originalRowData];
    }
  }

  openSystemDetails(system: system) {
    // Find users who created/last changed the department
    const createdByDetails = this.users.find(
      (user) => user.id === system.createdby
    );
    const lastchangedByDetails = this.users.find(
      (user) => user.id === system.lastChangedBy
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
        system.createdDate
          ? this.datePipe.transform(system.createdDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
      lastChangedBy: `Last Changed By: ${lastchangedByName}`,
      lastChangedDate: `Last Changed Date: ${
        system.lastChangedDate
          ? this.datePipe.transform(system.lastChangedDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
    };

    const status = system.status ? 'Active' : 'Inactive';

    const detailedDepartment = {
      ...system,
      status,
      history,
    };

    this.dialog.open(ViewSystemComponent, {
      width: '720px',
      data: detailedDepartment,
    });
  }
  // Confirm system deletion
  confirmDelete(systemId: number) {
    let userId = 0;
    this.store.select(selectUser).subscribe((data) => {
      userId = data.user.id;
    });
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this System?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(deleteSystem({ systemId, userId }));
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
