import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { takeUntil, Subject } from 'rxjs';
import { drTeam } from '../../../core/models/drTeam.model';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { appState } from '../../../core/store/app-state/app.state';
import {
  getPermissionIds,
  selectUser,
} from '../../../core/store/auth-state/auth.selector';
import {
  addDRTeamSuccess,
  editDRTeamSuccess,
  deleteDRTeamSuccess,
  getDRTeams,
  deleteDRTeam,
} from '../../../core/store/drTeam-state/drTeam.action';
import { selectAllDRTeams } from '../../../core/store/drTeam-state/drTeam.selector';
import { CustomButtonComponent } from '../../../shared/custom-button/custom-button.component';
import { StatusFilterComponent } from '../../../shared/status-filter/status-filter.component';
import { ConfirmDialogComponent } from '../../build-br-plan/confirm-dialog/confirm-dialog.component';
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
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ViewDrteamComponent } from '../view-drteam/view-drteam.component';
import { getAllUser } from '../../../core/store/user-state/user.action';
import { selectAllUsers } from '../../../core/store/user-state/user.selector';

@Component({
  selector: 'app-list-of-drteams',
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
  ],
  providers: [DatePipe],
  templateUrl: './list-of-drteams.component.html',
  styleUrl: './list-of-drteams.component.css',
})
export class ListOfDrteamsComponent {
  filterValue = '';
  route: ActivatedRoute | null | undefined;
  isDataLoaded: boolean = false;
  departments: { id: number; departmentName: string }[] = [];
  users: addUserModel[] = [];

  ngOnChanges() {}

  rowData: drTeam[] = [];
  originalRowData: drTeam[] = [];
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50];
  isBRManager: boolean = false;
  drTeams: { id: number; teamName: string }[] = [];
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
    private actions$: Actions,
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionIds) => {
        this.hasPermissionToCreate = permissionIds.includes('58');
        this.hasPermissionToEdit = permissionIds.includes('59');
        this.hasPermissionToDelete = permissionIds.includes('60');
        this.updateDisplayColumns();
      });

    this.getData();

    this.actions$
      .pipe(
        ofType(addDRTeamSuccess, editDRTeamSuccess, deleteDRTeamSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.getData();
      });

    this.cdr.detectChanges();
  }
  // Fetches DR teams and users from store
  getData() {
    this.store.dispatch(getDRTeams());
    this.store.dispatch(getAllUser());
    this.store.select(selectAllDRTeams).subscribe((data: drTeam[]) => {
      this.rowData = data;
      this.originalRowData = data;
    });
    this.store.select(selectAllUsers).subscribe((data) => {
      this.users = data;
    });
  }
  // Formatter for Active/Inactive status
  isActiveValueFormatter = (params: { value: boolean }) => {
    return params.value ? 'Active' : 'Inactive';
  };

  displayedColumns: ColDef[] = [];
  // Dynamically updates table columns based on user permissions
  updateDisplayColumns() {
    this.displayedColumns = [
      {
        field: 'teamName',
        headerName: 'DR Team Name',
        flex: 2,
        cellRenderer: (params: any) => {
          const link = document.createElement('a');
          link.href = 'javascript:void(0)';
          link.style.color = 'black';
          link.innerText = params.value;
          link.addEventListener('click', () => {
            this.ngZone.run(() => this.openDRTeamDetails(params.data));
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
            buttonClicked: (rowData: drTeam) => {
              this.createDRTeam(rowData);
            },
          };
        },
      });
    }

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
  // Opens DR Team creation/edit form
  createDRTeam(event?: drTeam) {
    if (event) {
      this.router.navigate(['../home/drTeamManagement/newDRTeamCreation'], {
        queryParams: { drTeamId: event.id },
      });
    } else {
      this.router.navigate([`../home/drTeamManagement/newDRTeamCreation`]);
    }
  }
  // Filters the DR Team list based on user input
  externalFilterChanged(newValue: string) {
    this.filterValue = newValue.toLowerCase();

    if (this.filterValue) {
      this.rowData = this.originalRowData.filter((row) => {
        return row.teamName.toLowerCase().includes(this.filterValue);
      });
    } else {
      this.rowData = [...this.originalRowData];
    }
  }
  // Confirms and dispatches a delete action
  confirmDelete(drTeamId: number) {
    let userId = 0;
    this.store.select(selectUser).subscribe((data) => {
      userId = data.user.id;
    });
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this DR Team?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(deleteDRTeam({ drTeamId, userId }));
      }
    });
  }

  openDRTeamDetails(drTeam: drTeam) {
    // Find users who created/last changed the department
    const createdByDetails = this.users.find(
      (user) => user.id === drTeam.createdBy
    );
    const lastchangedByDetails = this.users.find(
      (user) => user.id === drTeam.lastChangedBy
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
        drTeam.createdDate
          ? this.datePipe.transform(drTeam.createdDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
      lastChangedBy: `Last Changed By: ${lastchangedByName}`,
      lastChangedDate: `Last Changed Date: ${
        drTeam.lastChangedDate
          ? this.datePipe.transform(drTeam.lastChangedDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
    };

    const status = drTeam.status ? 'Active' : 'Inactive';

    const detailedDepartment = {
      ...drTeam,
      status,
      history,
    };

    this.dialog.open(ViewDrteamComponent, {
      width: '720px',
      data: detailedDepartment,
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
