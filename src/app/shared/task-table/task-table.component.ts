import { Component, Input, NgZone, SimpleChanges } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusHighlighterComponent } from '../status-highlighter/status-highlighter.component';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Task } from '../../core/models/task.model';
import { selectAllTasks } from '../../core/store/task-state/task.selector';
import {
  addTaskSuccess,
  deleteTask,
  editTaskSuccess,
  getTasks,
  resolveTaskProblem,
} from '../../core/store/task-state/task.action';
import { appState } from '../../core/store/app-state/app.state';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { ConfirmDialogComponent } from '../../features/build-br-plan/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { selectPlanById } from '../../core/store/plan-state/plan.selector';
import { getPlanById } from '../../core/store/plan-state/plan.action';
import { selectSequence } from '../../core/store/sequence-state/sequence.selector';
import { showSnackBar } from '../../core/store/snackbar-state/snackbar.action';
import { combineLatest, filter, forkJoin, take } from 'rxjs';
import {
  getPermissionIds,
  selectUser,
} from '../../core/store/auth-state/auth.selector';
import { InputFieldComponent } from '../input-field/input-field.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, NgIf } from '@angular/common';
import { ResolveProblemDialogComponent } from '../resolve-problem-dialog/resolve-problem-dialog.component';
import { TaskService } from '../../core/services/task.service';
import { TaskCreationComponent } from '../../features/build-br-plan/task-creation/task-creation.component';
import { Actions, ofType } from '@ngrx/effects';
import { environment } from '../../../environment/environment';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatIconModule,
    MatTableModule,
    MatIconModule,
    AgGridModule,
    NgIf,
    InputFieldComponent,
    DropdownComponent,
    StatusHighlighterComponent,
    MatMenuModule,
    CommonModule,
  ],
  templateUrl: './task-table.component.html',
  styleUrl: './task-table.component.css',
})
export class TaskTableComponent {
  @Input() planId: number = 0;
  @Input() sequenceId: number = 0;
  @Input() moduleName: string = 'a';
  @Input() refreshTrigger: number = 0;
  filterValue = '';
  route: ActivatedRoute | null | undefined;

  rowData: Task[] = [];
  originalRowData: Task[] = [];
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [5, 10, 20, 50];
  planStatus!: string;
  sequenceStatus!: string;
  hideDelete: boolean = true;
  hideEdit: boolean = true;
  hideResolve: boolean = true;
  hasPermissionToResolveProblem: boolean = false;
  hasPermissionToAllTask: boolean = false;
  displayedColumns: ColDef[] = [];
  filterByTaskStatus: { id: string; name: string }[] = [
    { id: 'All', name: 'All' },
    { id: 'InBuildNew', name: 'In Build New' },
    { id: 'InTestDispatched', name: 'In Test Dispatched' },
    { id: 'InTestAcknowledged', name: 'In Test Acknowledged' },
    { id: 'InTestCompleted', name: 'In Test Completed' },
    { id: 'InTestProblem', name: 'In Test Problem' },
    { id: 'InTestTaskTestFailed', name: 'In Test Task Test Failed' },
    { id: 'InExecuteDispatched', name: 'In Execute Dispatched' },
    { id: 'InExecuteAcknowledged', name: 'In Execute Acknowledged' },
    { id: 'InExecuteCompleted', name: 'In Execute Completed' },
    { id: 'InExecuteProblem', name: 'In Execute Problem' },
  ];

  constructor(
    private store: Store<appState>,
    private router: Router,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private taskService: TaskService,
    private actions$: Actions
  ) {}

  ngOnInit() {
    this.actions$
      .pipe(ofType(editTaskSuccess, addTaskSuccess))
      .subscribe(() => {
        this.getData();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      this.getData();
    }
    this.getData();
  }

  getData() {
    if (this.planId !== 0)
      this.store.dispatch(getPlanById({ id: this.planId }));

    forkJoin([
      this.store.select(selectPlanById).pipe(take(1)),
      this.store.select(selectUser).pipe(take(1)),
      this.store.select(getPermissionIds).pipe(take(1)),
    ]).subscribe(([plan, user, permissionIds]) => {
      if (plan) {
        this.planStatus = plan.planStatus;

        this.store
          .select(selectSequence)
          .pipe(take(2))

          .subscribe((sequence) => {
            this.store
              .select(selectAllTasks)
              .pipe(take(2))
              .subscribe((tasks) => {
                if (sequence) {
                  this.sequenceStatus = sequence.status;
                  this.rowData = tasks.map((task) => ({
                    ...task,
                    planStatus: this.planStatus,
                    sequenceStatus: this.sequenceStatus,
                  }));

                  this.originalRowData = [...this.rowData];

                  const userId = user.user.id;

                  if (tasks.length === 0) {
                    this.hideEdit = false;
                    this.hideDelete = false;
                  } else if (
                    permissionIds.includes('8') &&
                    permissionIds.includes('9') &&
                    permissionIds.includes('66')
                  ) {
                    this.hideDelete = false;
                    this.hideEdit = false;
                  } else if (
                    permissionIds.includes('8') &&
                    permissionIds.includes('66')
                  ) {
                    this.hideEdit = false;
                    this.hideDelete = true;
                  } else if (
                    permissionIds.includes('9') &&
                    permissionIds.includes('66')
                  ) {
                    this.hideEdit = true;
                    this.hideDelete = false;
                  } else if (tasks[tasks.length - 1].createdBy === userId) {
                    this.hideDelete = false;
                    this.hideEdit = false;
                  } else {
                    this.hideDelete = true;
                    this.hideEdit = true;
                  }
                  if (sequence.status !== 'SequenceBuildStarted') {
                    this.hideDelete = true;
                    this.hideEdit = true;
                  }
                  this.columnDefining();
                }
              });
          });
      }
    });

    this.store.select(getPermissionIds).subscribe((permissionIds) => {
      this.hasPermissionToResolveProblem = permissionIds.includes('43');
    });
  }

  viewTask(rowData: Task) {
    this.router.navigate([`/home/plans/taskDetails`], {
      queryParams: { taskId: rowData.id },
    });
  }

  editTask(rowData: Task) {
    combineLatest([
      this.store.select(selectPlanById),
      this.store.select(selectSequence),
    ])
      .pipe(
        take(1),
        filter(([plan, sequence]) => !!plan && !!sequence)
      )
      .subscribe(([plan, sequence]) => {
        if (
          plan.planStatus === 'PlanBuildInProgress' &&
          sequence.status === 'SequenceBuildStarted'
        ) {
          const dialogRef = this.dialog.open(TaskCreationComponent, {
            data: { sequenceId: rowData.sequenceId, taskId: rowData.id },
            width: 'auto',
            panelClass: ['full-screen-mobile-dialog'],
          });

          dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed)
              this.store.dispatch(getTasks({ sequenceId: rowData.id }));
          });
        } else {
          const message =
            plan.planStatus !== 'PlanBuildInProgress'
              ? "Plan not in 'PlanBuildInProgress' status"
              : "Sequence not in 'SequenceBuildStarted' status";

          this.store.dispatch(
            showSnackBar({
              message,
              actionLabel: 'Close',
              duration: 5000,
              status: 'success',
            })
          );
        }
      });
  }

  getTaskProblemDetails(taskId: number) {
    this.taskService.getTaskProblemDetails(taskId).subscribe(
      (data: any) => {
        const reportingMessage = data.reportingMessage;
        const reportingFilePath = data.reportingFilePath;
        const id = data.id;

        this.openResolveDialog(id, taskId, reportingMessage, reportingFilePath);
      },
      () => {}
    );
  }

  columnDefining() {
    this.displayedColumns = [
      {
        field: 'icon',
        headerName: '',
        cellRenderer: () => {
          const icon = document.createElement('span');
          icon.innerHTML = '<i class="material-icons">drag_indicator</i>';
          return icon;
        },
        flex: 0.5,
      },
      {
        field: 'taskTitle',
        flex: 3,
        cellRenderer: (params: any) => {
          const link = document.createElement('a');
          link.href = 'javascript:void(0)';
          link.style.color = 'black';
          link.style.textDecoration = 'underline';
          link.innerText = params.value;
          link.addEventListener('click', () => {
            this.ngZone.run(() => this.viewTask(params.data));
          });
          return link;
        },
      },
      {
        field: 'fileName',
        flex: 2,
        headerName: 'Attachment',
        cellRenderer: (params: any) => {
          if (!params.data.filePath) {
            const span = document.createElement('span');
            span.innerText = 'Not available';
            span.style.color = 'gray';
            return span;
          }
          const link = document.createElement('a');
          link.href = 'javascript:void(0)';
          link.style.color = 'blue';
          link.style.textDecoration = 'underline';
          link.innerText = params.value;
          link.title = params.value;
          link.addEventListener('click', () => {
            const fileUrl = `${environment.apiUrl}/${params.data.filePath}`;

            if (Capacitor.isNativePlatform()) {
              // 📱 Running inside Capacitor mobile app
              Browser.open({ url: fileUrl }); // opens in system browser (Safari/Chrome)
            } else {
              // 💻 Running in web browser — trigger a real download
              const anchor = document.createElement('a');
              anchor.href = fileUrl;
              anchor.download = params.value; // suggests filename
              anchor.target = '_blank';
              document.body.appendChild(anchor);
              anchor.click();
              document.body.removeChild(anchor);
            }
          });
          return link;
        },
      },
      {
        field: 'status',
        flex: 4,
        cellRenderer: StatusHighlighterComponent,
      },
      {
        field: 'delete',
        headerName: 'Delete',
        flex: 1.5,
        hide: this.hideDelete,
        cellRenderer: (params: any) => {
          const button = document.createElement('button');
          button.innerHTML = `<i class="material-icons">delete_outline</i>`;
          button.style.border = 'none';
          button.style.padding = '5px 10px';
          button.style.cursor = 'pointer';

          button.addEventListener('click', () => {
            this.ngZone.run(() => {
              this.confirmDelete(
                params.data.id,
                params.data.planStatus,
                params.data.sequenceStatus
              );
            });
          });

          return button;
        },
      },
      {
        field: 'Action',
        cellRenderer: CustomButtonComponent,
        flex: 1.5,
        hide: this.hideEdit,
        cellRendererParams: () => {
          return {
            buttonClicked: (rowData: Task) => {
              this.editTask(rowData);
            },
          };
        },
      },
    ];

    if (this.hasPermissionToResolveProblem) {
      const resolveColumn = {
        field: 'resolve',
        headerName: 'Resolve',
        flex: 2,
        cellRenderer: (params: any) => {
          if (
            params.data.status !== 'InTestProblem' &&
            params.data.status !== 'InExecuteProblem'
          ) {
            return null;
          }

          const button = document.createElement('button');
          button.innerHTML = 'RESOLVE';
          button.style.backgroundColor = '#3a3a81';
          button.style.color = '#ffffff';
          button.style.border = 'none';
          button.style.padding = '0px 4px';
          button.style.borderRadius = '4px';
          button.style.fontSize = '14px';
          button.style.fontWeight = '500';
          button.style.cursor = 'pointer';
          button.style.boxShadow =
            '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)';

          button.addEventListener('click', () => {
            if (params.data) {
              this.ngZone.run(() => {
                this.getTaskProblemDetails(params.data.id);
              });
            } else {
            }
          });

          return button;
        },
      };

      const hasResolvableTask = this.rowData.some(
        (task) =>
          task.status === 'InTestProblem' || task.status === 'InExecuteProblem'
      );

      if (hasResolvableTask && this.moduleName === 'buildBRPlan') {
        this.displayedColumns.push(resolveColumn);
      }
    }
  }

  openResolveDialog(
    id: number,
    taskId: number,
    reportingMessage: string,
    reportingFilePath: string
  ) {
    const dialogRef = this.dialog.open(ResolveProblemDialogComponent, {
      data: { id, taskId, reportingMessage, reportingFilePath },
      width: '800px',
      height: 'auto',
      maxHeight: '92vh',
      disableClose: false,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.submitSolution(
          result.id,
          result.taskId,
          result.solution,
          result.file
        );
      }
    });
  }

  submitSolution(
    id: number,
    taskId: number,
    solution: string,
    file: File | undefined
  ): void {
    let userId = 0;
    this.store
      .select(selectUser)
      .pipe(take(1))
      .subscribe((data) => {
        userId = data.user.id;
      });

    this.store.dispatch(
      resolveTaskProblem({
        id,
        taskId,
        message: solution,
        lastChangedBy: userId,
        sequenceId: this.sequenceId,
        file: file,
      })
    );
    this.getData();
  }

  confirmDelete(taskId: number, planStatus: string, sequenceStatus: string) {
    if (this.rowData.length > 0) {
      if (
        planStatus !== 'PlanBuildInProgress' ||
        sequenceStatus !== 'SequenceBuildStarted'
      ) {
        this.store.dispatch(
          showSnackBar({
            message:
              'Tasks can only be deleted when the Plan is "PlanBuildInProgress" and the Sequence is "SequenceBuildStarted"',
            status: 'error',
          })
        );
        return;
      }

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Delete Task',
          message:
            'Are you sure you want to delete this Task? This action can not be reversed if needed.',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed: any) => {
        if (confirmed) {
          this.store.dispatch(
            deleteTask({ taskId, sequenceId: this.sequenceId })
          );

          this.store
            .select(selectAllTasks)
            .pipe(take(1))
            .subscribe(() => {
              this.getData();
            });
        }
      });
    }
  }

  externalFilterChanged(newValue: string) {
    this.filterValue = newValue;
    if (this.filterValue === 'All') {
      this.rowData = [...this.originalRowData];
    } else if (this.filterValue) {
      this.rowData = this.originalRowData.filter(
        (row) =>
          row.taskTitle
            .toLowerCase()
            .includes(this.filterValue.toLowerCase()) ||
          row.status.includes(this.filterValue)
      );
    } else {
      this.rowData = [...this.originalRowData];
    }
  }
}
