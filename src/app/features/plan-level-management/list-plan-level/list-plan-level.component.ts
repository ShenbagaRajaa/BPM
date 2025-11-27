import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { planLevel } from '../../../core/models/planLevel.model';
import { appState } from '../../../core/store/app-state/app.state';
import { StatusFilterComponent } from '../../../shared/status-filter/status-filter.component';
import { DatePipe, isPlatformBrowser } from '@angular/common';
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
import { ViewPlanLevelComponent } from '../view-plan-level/view-plan-level.component';
import { ConfirmDialogComponent } from '../../build-br-plan/confirm-dialog/confirm-dialog.component';
import {
  getPermissionIds,
  selectUser,
} from '../../../core/store/auth-state/auth.selector';
import {
  addPlanLevelSuccess,
  deletePlanLevel,
  deletePlanLevelSuccess,
  editPlanLevelSuccess,
  getPlanLevels,
} from '../../../core/store/plan-level-state/plan-level.action';
import { CustomButtonComponent } from '../../../shared/custom-button/custom-button.component';
import { selectAllPlanLevels } from '../../../core/store/plan-level-state/plan-level.selector';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { selectAllUsers } from '../../../core/store/user-state/user.selector';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil, Subject } from 'rxjs';
import { getAllUser } from '../../../core/store/user-state/user.action';
@Component({
  selector: 'app-list-plan-level',
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
  templateUrl: './list-plan-level.component.html',
  styleUrl: './list-plan-level.component.css',
})
export class ListPlanLevelComponent {
  filterValue = '';
  route: ActivatedRoute | null | undefined;
  isDataLoaded: boolean = false;
  departments: { id: number; departmentName: string }[] = [];
  users!: addUserModel[];

  rowData: planLevel[] = [];
  originalRowData: planLevel[] = [];
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50];
  isBRManager: boolean = false;
  planLevels: { id: number; planLevelName: string }[] = [];
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
    private actions$: Actions,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Subscribe to permission updates to control access to actions
    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionIds) => {
        this.hasPermissionToCreate = permissionIds.includes('31');
        this.hasPermissionToEdit = permissionIds.includes('32');
        this.hasPermissionToDelete = permissionIds.includes('33');

        if (this.isBrowser) this.updateDisplayColumns();
      });
    this.getData();
    this.actions$
      .pipe(
        ofType(
          addPlanLevelSuccess,
          editPlanLevelSuccess,
          deletePlanLevelSuccess
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.getData(); // Refresh table data
      });

    this.cdr.detectChanges();
  }

  getData() {
     // Dispatch actions to fetch users and plan levels
    this.store.dispatch(getAllUser());
    this.store.dispatch(getPlanLevels());
    this.store.select(selectAllUsers).subscribe((data) => (this.users = data));

    this.store.select(selectAllPlanLevels).subscribe((data: planLevel[]) => {
      this.rowData = data;
      this.originalRowData = data;
    });
  }

  viewPlanLevelDetails(planLevel: planLevel) {
    this.openPlanLevelDetails(planLevel);
  }
 // Formatter for 'Status' field to display 'Active' or 'Inactive'
  isActiveValueFormatter = (params: { value: boolean }) => {
    return params.value ? 'Active' : 'Inactive';
  };

  displayedColumns: ColDef[] = [];

  updateDisplayColumns() {
       // Define columns based on permissions and other factors
    this.displayedColumns = [
      {
        field: 'planLevelName',
        headerName: 'Plan Level Name',
        flex: 2,
        cellRenderer: (params: any) => {
          const link = document.createElement('a');
          link.href = 'javascript:void(0)';
          link.style.color = 'black';
          link.innerText = params.value;
          link.addEventListener('click', () => {
            this.ngZone.run(() => this.openPlanLevelDetails(params.data));
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
            buttonClicked: (rowData: planLevel) => {
              this.createPlanLevel(rowData);
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

  createPlanLevel(event?: planLevel) {
    if (event) {
      this.router.navigate(
        ['../home/planLevelManagement/newPlanLevelCreation'],
        {
          queryParams: { planLevelId: event.id },
        }
      );
    } else {
      this.router.navigate([
        `../home/planLevelManagement/newPlanLevelCreation`,
      ]);
    }
  }

  externalFilterChanged(newValue: string) {
    this.filterValue = newValue.toLowerCase();

    if (this.filterValue) {
      this.rowData = this.originalRowData.filter((row) => {
        return row.planLevelName.toLowerCase().includes(this.filterValue);
      });
    } else {
      this.rowData = [...this.originalRowData];
    }
  }

  openPlanLevelDetails(planLevel: planLevel) {
      // Find users who created/last changed the department
      const createdByDetails = this.users.find(user => user.id === planLevel.createdBy);
      const lastchangedByDetails = this.users.find(user => user.id === planLevel.lastChangedBy);
  
      const createdByName = createdByDetails
        ? `${createdByDetails.employeeFirstName} ${createdByDetails.employeeLastName}`
        : 'N/A';
  
      const lastchangedByName = lastchangedByDetails
        ? `${lastchangedByDetails.employeeFirstName} ${lastchangedByDetails.employeeLastName}`
        : 'N/A';
  
      const history = {
        createdBy: `Created By: ${createdByName}`,
        createdDate: `Created Date: ${planLevel.createdDate
            ? this.datePipe.transform(planLevel.createdDate, 'yyyy-MM-dd')
            : 'N/A'
          }`,
        lastChangedBy: `Last Changed By: ${lastchangedByName}`,
        lastChangedDate: `Last Changed Date: ${planLevel.lastChangedDate
            ? this.datePipe.transform(planLevel.lastChangedDate, 'yyyy-MM-dd')
            : 'N/A'
          }`,
      };
  
      const status = planLevel.status ? 'Active' : 'Inactive';
  
      const detailedDepartment = {
        ...planLevel,
        status,
        history,
      };
  
      this.dialog.open(ViewPlanLevelComponent, {
        width: '720px',
        data: detailedDepartment,
      });
    }
  confirmDelete(planLevelId: number) {
    let userId = 0;
    this.store.select(selectUser).subscribe((data) => {
      userId = data.user.id;
    });
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this Plan Level?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(deletePlanLevel({ planLevelId, userId }));
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
