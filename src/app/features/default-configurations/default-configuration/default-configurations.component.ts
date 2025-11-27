import { Component, NgZone, OnInit } from '@angular/core';
import { ConfigurationSetting } from '../../../core/models/defaultConfig.model';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { appState } from '../../../core/store/app-state/app.state';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { CustomButtonComponent } from '../../../shared/custom-button/custom-button.component';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { AgGridAngular } from 'ag-grid-angular';
import {
  addConfigurationSuccess,
  deleteConfiguration,
  deleteConfigurationSuccess,
  getConfigurations,
  updateConfigurationSuccess,
} from '../../../core/store/configuration-settings-state/configuration-settings.action';
import { selectAllConfigurations } from '../../../core/store/configuration-settings-state/configuration-settings.selector';
import { ViewConfigurationSettingsComponent } from '../view-configuration-settings/view-configuration-settings.component';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { getAllUser } from '../../../core/store/user-state/user.action';
import { selectAllUsers } from '../../../core/store/user-state/user.selector';
import {
  getPermissionIds,
  selectUser,
} from '../../../core/store/auth-state/auth.selector';
import { Subject, takeUntil } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { ConfirmDialogComponent } from '../../build-br-plan/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-default-configuration',
  standalone: true,
  templateUrl: './default-configurations.component.html',
  styleUrls: ['./default-configurations.component.css'],
  imports: [
    NavigationbarComponent,
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatGridListModule,
    MatTableModule,
    MatCardModule,
    HttpClientModule,
    AgGridAngular,
    MatButtonModule,
  ],
})
export class DefaultConfigurationComponent implements OnInit {
  defaultConfigurations: ConfigurationSetting[] = [];
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50];
  users: addUserModel[] = [];
  hasPermissionToEdit: boolean = false;
  hasPermissionToCreate: boolean = false;
  hasPermissionToDelete: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<appState>,
    private router: Router,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private actions$: Actions
  ) {}

  ngOnInit() {
    // Fetch data on component initialization
    this.getData();
    // Subscribe to the permission IDs to control the visibility of columns based on permissions
    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionIds) => {
        this.hasPermissionToEdit = permissionIds.includes('52');
        this.hasPermissionToCreate = permissionIds.includes('51');
        this.hasPermissionToDelete = permissionIds.includes('61');
        this.updateDisplayColumns();
      });
    // Subscribe to configuration actions and reload data when changes occur
    this.actions$
      .pipe(
        ofType(
          addConfigurationSuccess,
          updateConfigurationSuccess,
          deleteConfigurationSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.getData();
      });
    this.store.dispatch(getAllUser());

    this.store.select(selectAllUsers).subscribe((data) => (this.users = data));
  }
  // Function to fetch configuration and user data
  getData() {
    this.store.dispatch(getConfigurations());
    this.store.select(selectAllConfigurations).subscribe((data) => {
      this.defaultConfigurations = data;
    });
    // Dispatch action to load users
    this.store.dispatch(getAllUser());
    this.store.select(selectAllUsers).subscribe((data) => (this.users = data));
  }

  openConfigurationDetails(config: ConfigurationSetting) {
    // Find users who created/last changed the department
    const createdByDetails = this.users.find(
      (user) => user.id === config.createdBy
    );
    const lastchangedByDetails = this.users.find(
      (user) => user.id === config.lastChangedBy
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
        config.createdDate
          ? this.datePipe.transform(config.createdDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
      lastChangedBy: `Last Changed By: ${lastchangedByName}`,
      lastChangedDate: `Last Changed Date: ${
        config.lastChangedDate
          ? this.datePipe.transform(config.lastChangedDate, 'yyyy-MM-dd')
          : 'N/A'
      }`,
    };

    const detailedDepartment = {
      ...config,
      history,
    };

    this.dialog.open(ViewConfigurationSettingsComponent, {
      width: '720px',
      data: detailedDepartment,
    });
  }

  displayedColumns: ColDef[] = [];
  // Update displayed columns based on permissions
  updateDisplayColumns() {
    this.displayedColumns = [
      {
        field: 'name',
        headerName: 'Setting Name',
        flex: 2,
        cellRenderer: (params: any) => {
          const link = document.createElement('a');
          link.innerText = params.value;
          link.addEventListener('click', () => {
            this.ngZone.run(() => this.openConfigurationDetails(params.data));
          });
          return link;
        },
      },

      {
        headerName: 'Setting Description',
        field: 'description',
        flex: 2,
      },
      {
        headerName: 'Setting Value',
        field: 'value',
        flex: 1,
      },
    ];
    // If the user has edit permissions, show the "Action" column
    if (this.hasPermissionToEdit) {
      this.displayedColumns.push({
        field: 'Action',
        sortable: false,
        cellRenderer: CustomButtonComponent,
        flex: 0.7,
        cellRendererParams: () => {
          return {
            buttonClicked: (rowData: any) => {
              this.createConfiguration(rowData);
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

  // Function to navigate to the configuration creation/edit page
  createConfiguration(event?: ConfigurationSetting) {
    if (event) {
      this.router.navigate(
        ['../home/defaultConfigurations/addConfigurationSettings'],
        {
          queryParams: { id: event.id },
        }
      );
    } else {
      this.router.navigate([
        `../home/defaultConfigurations/addConfigurationSettings`,
      ]);
    }
  }

  trackByFn(index: number, item: ConfigurationSetting): number {
    return item.id;
  }

  confirmDelete(settingId: number) {
    let userId = 0;
    this.store.select(selectUser).subscribe((data) => {
      userId = data.user.id;
    });
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this Default Setting?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(deleteConfiguration({ settingId, userId }));
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
