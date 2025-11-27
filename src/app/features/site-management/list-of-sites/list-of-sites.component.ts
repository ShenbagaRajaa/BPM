import {
  Component,
  NgZone,
  ChangeDetectorRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ColDef } from 'ag-grid-community';
import { appState } from '../../../core/store/app-state/app.state';
import { CustomButtonComponent } from '../../../shared/custom-button/custom-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AgGridAngular } from 'ag-grid-angular';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import {
  deleteSite,
  getSites,
} from '../../../core/store/site-state/site.action';
import { selectAllSites } from '../../../core/store/site-state/site.selector';
import { site } from '../../../core/models/site.model';
import { MatDialog } from '@angular/material/dialog';
import { ViewSiteComponent } from '../view-site/view-site.component';
import { ConfirmDialogComponent } from '../../build-br-plan/confirm-dialog/confirm-dialog.component';
import {
  getPermissionIds,
  selectUser,
} from '../../../core/store/auth-state/auth.selector';
import { StatusFilterComponent } from '../../../shared/status-filter/status-filter.component';
import { selectAllUsers } from '../../../core/store/user-state/user.selector';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { getAllUser } from '../../../core/store/user-state/user.action';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-of-sites',
  standalone: true,
  imports: [
    NavigationbarComponent,
    InputFieldComponent,
    AgGridAngular,
    MatMenuModule,
    MatIconModule,
  ],
  providers: [DatePipe],
  templateUrl: './list-of-sites.component.html',
  styleUrls: ['./list-of-sites.component.css'],
})
export class ListOfSitesComponent {
  filterValue = '';
  route: ActivatedRoute | null | undefined;
  hasPermissionToDelete: boolean = false;
  hasPermissionToEdit: boolean = false;
  hasPermissionToCreate: boolean = false;
  rowData: site[] = [];
  users: addUserModel[] = [];
  originalRowData: site[] = [];
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50];
  permissionIds: string[] = [];
  isBrowser: boolean;
  displayedColumns: ColDef[] = [];
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
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Subscribe to permission IDs to update UI permissions dynamically

    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionIds) => {
        if (permissionIds) {
          this.hasPermissionToCreate = permissionIds.includes('22');
          this.hasPermissionToEdit = permissionIds.includes('23');
          this.hasPermissionToDelete = permissionIds.includes('24');
          this.permissionIds = permissionIds;

          if (this.isBrowser) this.updateDisplayColumns();

          this.cdr.detectChanges();
        }
      });

    this.getData();
  }

  getData() {
    // Dispatch actions to retrieve sites and users from the store
    this.store.dispatch(getSites());
    this.store.dispatch(getAllUser());
    this.store.select(selectAllUsers).subscribe((data) => (this.users = data));
    this.store.select(selectAllSites).subscribe((data) => {
      this.rowData = data;
      this.originalRowData = data;
    });
  }
  // Formatter for status column: Converts boolean to 'Active'/'Inactive'
  isActiveValueFormatter = (params: { value: boolean }) => {
    return params.value ? 'Active' : 'Inactive';
  };

  updateDisplayColumns() {
    // Define columns for the table
    this.displayedColumns = [
      {
        field: 'siteName',
        flex: 1,
        cellRenderer: (params: any) => {
          const link = document.createElement('a');
          link.href = 'javascript:void(0)';
          link.style.color = 'black';
          link.innerText = params.value;
          link.addEventListener('click', () => {
            this.ngZone.run(() => this.openSiteDetails(params.data));
          });
          return link;
        },
      },
      { field: 'siteCode', flex: 1, sortable: false },
      { field: 'state', flex: 1, sortable: false },
      {
        field: 'country',
        flex: 1,
        sortable: false,
      },
      { headerName: 'Location', field: 'address', flex: 1, sortable: false },
      { headerName: 'City', field: 'city', flex: 1, sortable: false },
      {
        headerName: 'Status',
        field: 'status',
        flex: 1,
        cellRenderer: (params: any) => {
          return params.value ? 'Active' : 'Inactive';
        },
        filter: StatusFilterComponent,
      },
    ];

    // Add edit button column if user has edit permission
    if (this.hasPermissionToEdit) {
      this.displayedColumns.push({
        field: 'Action',
        sortable: false,
        cellRenderer: CustomButtonComponent,
        flex: 0.7,
        cellRendererParams: () => {
          return {
            buttonClicked: (rowData: site) => {
              this.createSite(rowData);
            },
          };
        },
      });
    }
    // Add delete button column if user has delete permission
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
  // Navigate to site creation page
  createSite(event?: site) {
    if (event) {
      this.router.navigate(['../home/siteManagement/newSiteCreation'], {
        queryParams: { siteId: event.id },
      });
    } else {
      this.router.navigate([`../home/siteManagement/newSiteCreation`]);
    }
  }
  // Apply external filter to table data
  externalFilterChanged(newValue: string) {
    this.filterValue = newValue;

    if (this.filterValue) {
      this.rowData = this.originalRowData.filter(
        (row) =>
          row.siteName.toLowerCase().includes(this.filterValue) ||
          row.siteCode.toLowerCase().includes(this.filterValue)
      );
    } else {
      this.rowData = [...this.originalRowData];
    }
  }
  // Show confirmation dialog before deleting a site
  confirmDelete(siteId: number) {
    let userId = 0;
    this.store.select(selectUser).subscribe((data) => {
      userId = data.user.id;
    });
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this Site?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(deleteSite({ siteId, userId }));
      }
    });
  }

  openSiteDetails(site: site) {
    // Find users who created/last changed the department
    const createdByDetails = this.users.find(
      (user) => user.id === site.createdBy
    );
    const lastchangedByDetails = this.users.find(
      (user) => user.id === site.lastChangedBy
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
        site.createdDate
          ? this.datePipe.transform(site.createdDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
      lastChangedBy: `Last Changed By: ${lastchangedByName}`,
      lastChangedDate: `Last Changed Date: ${
        site.lastChangedDate
          ? this.datePipe.transform(site.lastChangedDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
    };

    const status = site.status ? 'Active' : 'Inactive';

    const detailedDepartment = {
      ...site,
      status,
      history,
    };

    this.dialog.open(ViewSiteComponent, {
      width: '720px',
      data: detailedDepartment,
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
