import { Component, Input, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../../core/models/task.model';
import { appState } from '../../../core/store/app-state/app.state';
import {
  getPermissionIds,
  selectUser,
} from '../../../core/store/auth-state/auth.selector';
import { userbyrole } from '../../../core/models/userByRole.model';
import { sequenceUpdate } from '../../../core/models/sequenceUpdate.model';
import {
  deleteSequence,
  editSequence,
} from '../../../core/store/sequence-state/sequence.action';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { selectSequence } from '../../../core/store/sequence-state/sequence.selector';
import { showSnackBar } from '../../../core/store/snackbar-state/snackbar.action';
import { selectPlanById } from '../../../core/store/plan-state/plan.selector';
import { selectAllTasks } from '../../../core/store/task-state/task.selector';
import { combineLatest, take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { TaskCreationComponent } from '../task-creation/task-creation.component';
import { getTasks } from '../../../core/store/task-state/task.action';

@Component({
  selector: 'app-task-creation-accordion',
  standalone: true,
  imports: [
    CdkAccordionModule,
    ReactiveFormsModule,
    NgIf,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './task-creation-accordion.component.html',
  styleUrl: './task-creation-accordion.component.css',
})
export class TaskCreationAccordionComponent {
  filterByPlanStatus: string[] = [
    'All',
    'PlanBuildInProcess',
    'PlanReadyToBeTest',
    'PlanExecutionInProcess',
  ];
  primaryTeamMembers: userbyrole[] = [];
  backupTeamMembers: userbyrole[] = [];
  saveButtonDisabled = true;
  @Input() sequenceId: number = 0;
  @Input() planId: number = 0;
  userId = 0;
  userRole: string | number = '';
  buildBRPlan!: FormGroup;
  taskId: number = 0;
  tasks: Task[] = [];
  sequenceCreatorId: number | null = null;
  isSequenceComplete: boolean = false;
  addTaskButton: boolean = true;
  isIncludeTask: boolean = true;
  hasPermissionToDeleteSequence: boolean = false;
  hasPermissionToEditSequence: boolean = false;
  hasPermissionToAddTask: boolean = false;
  hasPermissionToAllTask: boolean = false;

  constructor(
    private store: Store<appState>,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Fetch initial data when the component is initialized
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Fetch data when sequenceId or planId changes
    if (changes['planId'] || changes['sequenceId']) {
    }
    this.getData();
    if (!this.sequenceId) {
      this.sequenceCreatorId = null;
      return;
    }

    this.store.select(selectSequence).subscribe((sequence) => {
      if (sequence && sequence.id === this.sequenceId) {
        this.sequenceCreatorId = sequence.createdBy;
      }
    });
  }

  getData() {
    // If sequenceId is not set, retrieve it from query parameters
    if (this.sequenceId === 0) {
      this.route.queryParams.pipe(take(1)).subscribe((params) => {
        this.taskId = params['taskId'];
        this.sequenceId = params['sequenceId'];
      });
    }
    // Combine user details and permission data
    combineLatest([
      this.store.select(selectUser),

      this.store.select(getPermissionIds),
    ])
      .pipe(take(1))
      .subscribe(([userData, permissionIds]) => {
        this.userId = userData.user.id;
        this.hasPermissionToDeleteSequence = permissionIds.includes('6');
        this.hasPermissionToEditSequence = permissionIds.includes('5');
        this.hasPermissionToAddTask = permissionIds.includes('7');
        this.hasPermissionToAllTask = permissionIds.includes('66');
        this.userRole = userData.user.role;

        this.store.select(selectSequence).subscribe((sequenceData) => {
          this.isSequenceComplete =
            sequenceData.status !== 'SequenceBuildStarted';
        });

        // Check if tasks exist and set permissions for adding tasks
        this.store.select(selectAllTasks).subscribe((tasks) => {
          this.isIncludeTask = tasks.length === 0 ? false : true;

          // Enable add task button only if user has all-task permission
          // or last task is created by current user, or no tasks exist
          if (
            this.hasPermissionToAllTask ||
            tasks[tasks.length - 1]?.createdBy === userData.user.id ||
            tasks.length === 0
          ) {
            this.addTaskButton = false;
          } else {
            this.addTaskButton = true;
          }
        });
      });
  }

  updateSequence() {
    this.store
      .select(selectAllTasks)
      .pipe(take(1))
      .subscribe((tasks) => {
        // Check if all tasks are in 'InBuildNew' status
        const allBuildInNew = tasks.every(
          (task) => task.status === 'InBuildNew'
        );
        // Show error message if no tasks exist
        if (tasks.length === 0) {
          this.store.dispatch(
            showSnackBar({
              message: 'Please Add atleast one task within the sequence.',
              actionLabel: 'Close',
              duration: 5000,
              status: 'error',
            })
          );
        } else if (allBuildInNew) {
          // Update sequence status
          this.store
            .select(selectSequence)
            .pipe(take(1))
            .subscribe((data) => {
              const sequenceUpdateData: sequenceUpdate = {
                id: this.sequenceId,
                status: 'SequenceBuildCompleted',
                sequenceNumber: data.sequenceNumber,
                lastChangedBy: this.userId,
              };

              this.store.dispatch(
                editSequence({
                  editSequence: sequenceUpdateData,
                  planId: this.planId,
                })
              );

              this.isSequenceComplete = true;
            });
        } else {
          // Show error snackbar if not all tasks are in 'InBuildNew' status
          this.store.dispatch(
            showSnackBar({
              message: "Some Task(s) not in 'BuildInNew' status",
              actionLabel: 'Close',
              duration: 5000,
              status: 'error',
            })
          );
        }
      });
  }

  addTask() {
    // Navigate to the task creation page
    const dialogRef = this.dialog.open(TaskCreationComponent, {
      width: 'auto',
      data: { sequenceId: this.sequenceId, taskId: this.taskId },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(getTasks({ sequenceId: this.sequenceId }));
      }
    });
  }

  confirmDelete(sequenceId: number) {
    this.store
      .select(selectPlanById)
      .pipe(take(1))
      .subscribe((data) => {
        if (data.planStatus === 'PlanBuildInProgress') {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Delete',
              message:
                'Are you sure you want to delete this Sequence? <br>Deleting this sequence will also delete all associated tasks.',
            },
          });

          dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
              this.store.dispatch(
                deleteSequence({ sequenceId, planId: this.planId })
              );
            }
          });
        } else {
          this.store.dispatch(
            showSnackBar({
              message: "Plan not in 'PlanBuildInProgress' status",
              actionLabel: 'Close',
              duration: 5000,
              status: 'success',
            })
          );
        }
      });
  }
}
