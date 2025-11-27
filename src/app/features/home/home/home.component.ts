import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { StatusHighlighterComponent } from '../../../shared/status-highlighter/status-highlighter.component';
import { Router } from '@angular/router';
import { plan } from '../../../core/models/plan.model';
import { HttpClientModule } from '@angular/common/http';
import { selectAllPlans } from '../../../core/store/plan-state/plan.selector';
import {
  deletePlan,
  deletePlanSuccess,
  getAllPlan,
} from '../../../core/store/plan-state/plan.action';
import { appState } from '../../../core/store/app-state/app.state';
import { AgGridAngular } from 'ag-grid-angular';
import { planDisplay } from '../../../core/models/planDisplay.model';
import { getPermissionIds } from '../../../core/store/auth-state/auth.selector';
import { ConfirmDialogComponent } from '../../build-br-plan/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, isPlatformBrowser, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  FirstDataRenderedEvent,
  GridSizeChangedEvent,
} from 'ag-grid-community';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { showSnackBar } from '../../../core/store/snackbar-state/snackbar.action';
import { Subject, takeUntil } from 'rxjs';
import { PlanDetailsService } from '../../../core/services/plan-details.service';
import { Actions, ofType } from '@ngrx/effects';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    InputFieldComponent,
    DropdownComponent,
    MatGridListModule,
    MatTableModule,
    NavigationbarComponent,
    MatCardModule,
    HttpClientModule,
    AgGridAngular,
    NgIf,
    MatButtonModule,
    StatusHighlighterComponent,
    MatIconModule,
    MatMenuModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isBrowser: boolean;
  hasPermissionToDeleteBRPlan: boolean = false;

  filterByPlanStatus: { id: string; name: string }[] = [
    { id: 'All', name: 'All' },
    { id: 'PlanBuildInProgress', name: 'Plan Build In Progress' },
    { id: 'PlanBuildReady', name: 'Plan Build Ready' },
    { id: 'PlanReadyToBeTested', name: 'Plan Ready To Be Tested' },
    { id: 'PlanTestInProgress', name: 'Plan Test In Progress' },
    { id: 'PlanTested', name: 'Plan Tested' },
    { id: 'PlanApproved', name: 'Plan Approved' },
    { id: 'PlanReadyToBeExecuted', name: 'Plan Ready To Be Executed' },
    { id: 'PlanExecutionInProgress', name: 'Plan Execution In Progress' },
    { id: 'PlanExecuted', name: 'Plan Executed' },
    { id: 'PlanTestAborted', name: 'Plan Test Aborted' },
  ];

  displayedColumns: any[] = [];

  ngOnChanges() {}

  rowData: planDisplay[] = [];
  originalRowData: planDisplay[] = [];
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50];
  isBRManagerOrAdministrator: boolean = false;
  hasPermissionToCreateBRPlan: boolean = false;
  hasPermissionToReBuild: boolean = false;
  hasPermissionToExport: boolean = false;
  hasPermissionToImport: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<appState>,
    private router: Router,
    private ngZone: NgZone,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    private planDetailsService: PlanDetailsService,
    private actions$: Actions
  ) {
    // Check if the platform is browser
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.getData();

    this.actions$
      .pipe(ofType(deletePlanSuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.getData(); // Refresh table data
      });
  }

  getData() {
    this.store.dispatch(getAllPlan());

    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionIds) => {
        this.hasPermissionToCreateBRPlan = permissionIds.includes('1');
        this.hasPermissionToDeleteBRPlan = permissionIds.includes('3');
        this.hasPermissionToReBuild = permissionIds.includes('67');
        this.cloumnDefining(permissionIds.includes('3'));
      });

    this.store.select(selectAllPlans).subscribe((plans: plan[]) => {
      this.rowData = plans.map((planss) => ({
        ...planss,
        completedSequences: 0,
        incompletedSequences: 0,
      }));
      this.originalRowData = [...this.rowData];
    });
  }

  // Define columns dynamically based on permissions
  cloumnDefining(val: boolean) {
    this.displayedColumns = [
      {
        field: 'planName',
        flex: 1.2,
        cellRenderer: (params: any) => {
          const link = document.createElement('a');
          link.href = 'javascript:void(0)';
          link.style.color = 'black';
          link.style.textDecoration = 'underline';
          link.innerText = params.value;
          link.addEventListener('click', () => {
            this.ngZone.run(() => this.planDetails(params.data));
          });
          return link;
        },
      },
      {
        field: 'createdDate',
        flex: 1.2,
        valueFormatter: (params: any) => {
          if (params.value) {
            return new Date(params.value).toLocaleDateString();
          }
          return '';
        },
      },
      {
        field: 'planStatus',
        flex: 3,
        cellRenderer: StatusHighlighterComponent,
        cellRendererParams: () => {
          return {
            buttonClicked: (rowData: planDisplay) => {
              this.planDetails(rowData);
            },
          };
        },
      },
    ];

    if (true) {
      this.displayedColumns.push({
        field: 'planId',
        headerName: 'Action',
        sortable: false,
        flex: 0.7,
        cellRenderer: (params: any) => {
          const button = document.createElement('button');
          button.innerHTML = '<i class="material-icons text-white">edit</i>';
          button.style.backgroundColor = '#3a3a81';
          button.style.color = '#ffffff';
          button.style.border = 'none';
          button.style.padding = '0px 0px';
          button.style.marginTop = '7px';
          button.style.borderRadius = '4px';
          button.style.fontSize = '14px';
          button.style.fontWeight = '500';
          button.style.cursor = 'pointer';
          button.style.boxShadow =
            '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)';

          button.style.whiteSpace = 'break-spaces';
          button.style.wordBreak = 'break-word';
          button.style.width = '30px';
          button.style.maxWidth = '80px'; // Adjust this value based on your needs
          button.style.minHeight = '32px';
          button.style.lineHeight = '1.2';
          button.style.display = 'flex';
          button.style.alignItems = 'center';
          button.style.justifyContent = 'center';
          button.style.textAlign = 'center';

          button.addEventListener('click', () => {
            this.ngZone.run(() => {
              this.navigateEdit(params.data);
            });
          });

          return button;
        },
      });
    }

    if (val) {
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
              this.confirmDelete(params.data.id, params.data.planStatus);
            });
          });

          return button;
        },
      });
    }

    if (this.hasPermissionToReBuild) {
      this.displayedColumns.push({
        field: 'rebuild',
        headerName: 'Rebuild',
        flex: 1,
        cellRenderer: (params: any) => {
          if (params.data.planStatus === 'PlanBuildInProgress') {
            return null;
          }

          const button = document.createElement('button');
          // button.innerHTML = `<i class="material-icons text-text">settings_backup_restore</i>`;
          // button.style.border = 'none';
          // button.style.padding = '5px 10px';
          // button.style.cursor = 'pointer';
          button.innerHTML = 'RE-BUILD';
          button.style.backgroundColor = '#3a3a81';
          button.style.color = '#ffffff';
          button.style.border = 'none';
          button.style.padding = '0px 0px';
          button.style.marginTop = '7px';
          button.style.borderRadius = '4px';
          button.style.fontSize = '14px';
          button.style.fontWeight = '500';
          button.style.cursor = 'pointer';
          button.style.boxShadow =
            '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)';

          button.style.whiteSpace = 'break-spaces';
          button.style.wordBreak = 'break-word';
          button.style.width = '70px';
          button.style.maxWidth = '80px'; // Adjust this value based on your needs
          button.style.minHeight = '32px';
          button.style.lineHeight = '1.2';
          button.style.display = 'flex';
          button.style.alignItems = 'center';
          button.style.justifyContent = 'center';
          button.style.textAlign = 'center';

          button.addEventListener('click', () => {
            this.ngZone.run(() => {
              this.rebuildPlan(params.data.id);
            });
          });

          return button;
        },
      });
    }

    if (this.hasPermissionToExport) {
      this.displayedColumns.push({
        field: 'export',
        headerName: 'Export',
        flex: 0.7,
        cellRenderer: (params: any) => {
          const button = document.createElement('button');
          button.innerHTML = `<i class="material-icons text-text">save_alt</i>`;
          button.style.border = 'none';
          button.style.padding = '5px 10px';
          button.style.cursor = 'pointer';

          button.addEventListener('click', () => {
            this.ngZone.run(() => {
              this.exportPlanExcel(params.data.id);
            });
          });

          return button;
        },
      });
    }

    if (this.hasPermissionToImport) {
      this.displayedColumns.push({
        field: 'import',
        headerName: 'Import',
        flex: 0.7,
        cellRenderer: (params: any) => {
          const button = document.createElement('button');
          button.innerHTML =
            '<i class="material-icons text-text">ios_share</i>';
          button.style.border = 'none';
          button.style.padding = '5px 10px';
          button.style.cursor = 'pointer';

          button.addEventListener('click', () => {
            this.ngZone.run(() => {
              this.importPlanExcel(params.data.id);
            });
          });

          return button;
        },
      });
    }
  }

  exportPlanExcel(planId: number) {
    this.planDetailsService.exportPlanExcel(planId).subscribe({
      next: () => {
        this.store.dispatch(
          showSnackBar({
            message: 'Plan imported successfully',
            status: 'success',
          })
        );
        this.store.dispatch(getAllPlan());
      },
      error: (error: any) => {
        this.store.dispatch(
          showSnackBar({ message: error?.error?.details, status: 'error' })
        );
      },
    });
  }

  importPlanExcel(planId: number) {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '600px',
      data: { planId: planId },
    });

    dialogRef.afterClosed().subscribe((file: File) => {
      if (file) {
        this.planDetailsService
          .importPlanExcel(planId, file)
          .subscribe(() => {});
      }
    });
  }

  rebuildPlan(planId: number) {
    this.planDetailsService.rebuildPlan(planId).subscribe({
      next: () => {
        this.store.dispatch(
          showSnackBar({
            message: 'Plan rebuilded successfully',
            status: 'success',
          })
        );
        this.store.dispatch(getAllPlan());
      },
      error: (error: any) => {
        this.store.dispatch(
          showSnackBar({ message: error?.error?.details, status: 'error' })
        );
      },
    });
  }

  planDetails(rowData: planDisplay) {
    this.router.navigate(['home/plans/planDetails'], {
      queryParams: { planId: rowData.id },
    });
  }

  navigateEdit(rowData: planDisplay) {
    this.router.navigate(['home/buildBRPlan/add-plan'], {
      queryParams: { planId: rowData.id },
    });
  }

  navigateAdd() {
    this.router.navigate(['home/buildBRPlan/add-plan'], {
      queryParams: { planId: 0 },
    });
  }

  filterValue = '';

  isActiveValueFormatter = (params: { value: boolean }) => {
    return params.value ? 'Active' : 'Inactive';
  };

  // Filter plans based on the search value
  externalFilterChanged(newValue: string) {
    this.filterValue = newValue;

    if (this.filterValue === 'All') {
      this.rowData = [...this.originalRowData];
    } else if (this.filterValue) {
      this.rowData = this.originalRowData.filter(
        (row) =>
          row.planName.toLowerCase().includes(this.filterValue.toLowerCase()) ||
          row.planStatus.includes(this.filterValue)
      );
    } else {
      this.rowData = [...this.originalRowData];
    }
  }

  // Method to confirm deletion of a plan
  confirmDelete(planId: number, planStatus: string) {
    if (planStatus !== 'PlanBuildInProgress') {
      this.store.dispatch(
        showSnackBar({
          message:
            'Plans can only be deleted when the status is "PlanBuildInProgress".',
          status: 'error',
        })
      );
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: 'Delete',
        message:
          'Are you sure you want to delete this Plan? <br>Deleting this plan will also delete all associated sequences and tasks. This action is irreversible.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(deletePlan({ planId }));
        if (
          parseInt(localStorage.getItem('selectedPlanId') || '0') === planId
        ) {
          localStorage.removeItem('selectedPlanId');
        }
      }
    });
  }

  // Grid event to adjust columns to fit the grid after the first data is rendered
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }
  // Grid event to handle grid resizing and column visibility based on available space
  onGridSizeChanged(params: GridSizeChangedEvent) {
    // get the current grids width
    var gridWidth = document.querySelector('.ag-body-viewport')!.clientWidth;
    // keep track of which columns to hide/show
    var columnsToShow = [];
    var columnsToHide = [];
    // iterate over all columns (visible or not) and work out
    // now many columns can fit (based on their minWidth)
    var totalColsWidth = 0;
    var allColumns = params.api.getColumns();
    if (allColumns && allColumns.length > 0) {
      for (var i = 0; i < allColumns.length; i++) {
        var column = allColumns[i];
        totalColsWidth += column.getMinWidth();
        if (totalColsWidth > gridWidth) {
          columnsToHide.push(column.getColId());
        } else {
          columnsToShow.push(column.getColId());
        }
      }
    }
  }

  // Subject to manage unsubscription for cleanup
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
