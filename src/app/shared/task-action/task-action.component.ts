import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NavigationbarComponent } from '../navigationbar/navigationbar.component';
import { StatusHighlighterComponent } from '../status-highlighter/status-highlighter.component';
import { plan } from '../../core/models/plan.model';
import { appState } from '../../core/store/app-state/app.state';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { selectSequence } from '../../core/store/sequence-state/sequence.selector';
import {
  getTask,
  taskAcknowledges,
  taskAcknowledgeSuccess,
  taskCompletion,
  taskCompletionSuccess,
} from '../../core/store/task-state/task.action';
import { Sequence } from '../../core/models/Sequence.model';
import { Task } from '../../core/models/task.model';
import { getPlanById } from '../../core/store/plan-state/plan.action';
import { getSequence } from '../../core/store/sequence-state/sequence.action';
import { selectTask } from '../../core/store/task-state/task.selector';
import { selectPlanById } from '../../core/store/plan-state/plan.selector';
import { selectUser } from '../../core/store/auth-state/auth.selector';
import { addUserModel } from '../../core/models/UserCreationTemp.model';
import { ReportProblemComponent } from '../report-problem/report-problem.component';
import { TaskService } from '../../core/services/task.service';
import { environment } from '../../../environment/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Subject, filter, takeUntil } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-task-action',
  standalone: true,
  imports: [
    NavigationbarComponent,
    StatusHighlighterComponent,
    MatDividerModule,
    MatDialogModule,
    NgIf,
    DatePipe,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './task-action.component.html',
  styleUrl: './task-action.component.css',
})
export class TaskActionComponent {
  ackowledgeDateTime = new Date();
  problemReportedDateTime = new Date();
  completionDateTime = new Date();
  completion = false;
  ackowledge = false;
  problemReported = false;
  show = false;
  buttonContainer = false;
  buttonShow = false;
  buttonValue = 'ACKNOWLEDGE';
  resolveMessage: string = '';
  uploadedFileUrl: string = '';
  apiUrl = environment.apiUrl + '/';
  resolvingFilePath: string | null = null;
  resolvingFileName: string = '';
  taskFileURL: string | null = null;
  taskFileName: string = '';
  sequence!: Sequence;
  task!: Task;
  plan!: plan;
  user!: addUserModel;
  taskId: number = 0;
  planId: number = 0;
  eventTypeId: number = 0;
  retries: number = 0;
  sequenceId: number = 0;
  token: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<appState>,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private actions$: Actions
  ) {
    // Subscribe to router events to detect navigation
    // this.router.events
    //   .pipe(
    //     filter((event) => event instanceof NavigationEnd),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe(() => {
    //     this.loadDataFromParams();
    //   });
  }

  // ngOnInit() {
  //   this.loadDataFromParams();

  //   this.actions$
  //     .pipe(ofType(taskCompletionSuccess), takeUntil(this.destroy$))
  //     .subscribe(() => {
  //       this.loadDataFromParams();
  //       setTimeout(() => {
  //         this.completion = true;
  //         this.buttonContainer = false;
  //         this.cdr.detectChanges();
  //       });
  //     });

  //   this.actions$
  //     .pipe(ofType(taskAcknowledgeSuccess), takeUntil(this.destroy$))
  //     .subscribe(() => {
  //       this.ackowledge = true;

  //       setTimeout(() => {
  //         this.loadDataFromParams();
  //         this.buttonValue = 'COMPLETE';
  //         this.buttonShow = true;
  //         this.cdr.detectChanges();
  //       });
  //     });
  // }

  // //Fetches query parameters and updates state accordingly.
  // private loadDataFromParams() {
  //   this.route.queryParams
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((params) => {

  //       this.planId = params['brPlanId'];
  //       this.sequenceId = params['sequenceId'];
  //       this.taskId = params['taskId'];
  //       this.retries = params['retries'];
  //       this.eventTypeId = params['eventTypeId'];

  //       this.store.dispatch(getSequence({ sequenceId: this.sequenceId }));
  //       this.store.dispatch(getPlanById({ id: this.planId }));
  //       this.store.dispatch(getTask({ taskId: this.taskId }));
  //       this.handleDisplayDetails();
  //     });

  //   this.store
  //     .select(selectSequence)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((sequence) => {
  //       this.sequence = sequence;
  //     });
  //   this.handleDisplayDetails();
  //   this.store
  //     .select(selectPlanById)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((plan1) => {
  //       this.plan = plan1;
  //     });

  //   this.store
  //     .select(selectUser)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((userDetail) => {
  //       this.user = userDetail.user;
  //     });
  // }
  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (!params['taskId']) {
          console.warn('Query params not ready yet');
          return;
        }

        this.planId = +params['brPlanId'];
        this.sequenceId = +params['sequenceId'];
        this.taskId = +params['taskId'];
        this.retries = +params['retries'];
        this.eventTypeId = +params['eventTypeId'];

        // NOW call the APIs (guaranteed)
        this.store.dispatch(getSequence({ sequenceId: this.sequenceId }));
        this.store.dispatch(getPlanById({ id: this.planId }));
        this.store.dispatch(getTask({ taskId: this.taskId }));

        this.handleDisplayDetails();
      });

    // Listen API responses
    this.subscribeTaskActions();

    // Load store data
    this.subscribeStore();
  }
  private subscribeTaskActions() {
    this.actions$
      .pipe(ofType(taskCompletionSuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.completion = true;
        this.buttonContainer = false;
        this.cdr.detectChanges();
      });

    this.actions$
      .pipe(ofType(taskAcknowledgeSuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.ackowledge = true;
        this.buttonValue = 'COMPLETE';
        this.buttonShow = true;
        this.cdr.detectChanges();
      });
  }
  private subscribeStore() {
    this.store
      .select(selectSequence)
      .pipe(takeUntil(this.destroy$))
      .subscribe((seq) => (this.sequence = seq));

    this.store
      .select(selectPlanById)
      .pipe(takeUntil(this.destroy$))
      .subscribe((plan) => (this.plan = plan));

    this.store
      .select(selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((u) => (this.user = u?.user));
  }

  handleDisplayDetails() {
    this.store
      .select(selectTask)
      .pipe(takeUntil(this.destroy$))
      .subscribe((task) => {
        this.task = task;
        this.taskFileURL =
          this.task.filePath || 'Documents\\TaskProblem\\Task_566\\1.PNG';
        this.taskFileName = this.task.fileName || '1.PNG';
        if (
          task.status === 'InTestDispatched' ||
          task.status === 'InExecuteDispatched'
        ) {
          this.ackowledge = false;
          this.buttonShow = false;
          this.problemReported = false;
          this.buttonContainer = true;
          this.buttonShow = false;
          this.completion = false;
          this.resolveMessage = '';
          this.resolvingFilePath = null;
          this.buttonValue = 'ACKNOWLEDGE';
        }
        if (
          task.status === 'InTestAcknowledged' ||
          task.status === 'InExecuteAcknowledged'
        ) {
          this.ackowledgeDateTime = task.acknowledgedDate
            ? new Date(task.acknowledgedDate)
            : new Date();

          this.ackowledge = true;
          this.buttonShow = true;
          this.buttonValue = 'COMPLETE';
          this.buttonContainer = true;
        }
        if (
          task.status === 'InTestProblem' ||
          task.status === 'InExecuteProblem'
        ) {
          this.ackowledgeDateTime = task.acknowledgedDate
            ? new Date(task.acknowledgedDate)
            : new Date();
          this.ackowledge = true;
          this.buttonValue = 'COMPLETE';
          this.buttonShow = true;
        }
        if (
          this.task.status === 'InTestProblemResolved' ||
          this.task.status === 'InExecuteProblemResolved'
        ) {
          this.buttonShow = true;
          this.buttonValue = 'COMPLETE';
          this.cdr.detectChanges();
          this.fetchResolveMessage();
          this.problemReportedDateTime = task.problemReportedDate
            ? new Date(task.problemReportedDate)
            : new Date();
          this.ackowledgeDateTime = task.acknowledgedDate
            ? new Date(task.acknowledgedDate)
            : new Date();
          this.problemReported = true;
          this.ackowledge = true;
        }
        if (
          task.status === 'InTestCompleted' ||
          task.status === 'InExecuteCompleted'
        ) {
          this.ackowledgeDateTime = task.acknowledgedDate
            ? new Date(task.acknowledgedDate)
            : new Date();
          this.ackowledge = true;
          if (task.reportedProblemBy) {
            this.problemReportedDateTime = task.problemReportedDate
              ? new Date(task.problemReportedDate)
              : new Date();
            this.problemReported = true;
          }
          this.completionDateTime = task.completedDate
            ? new Date(task.completedDate)
            : new Date();
          this.completion = true;
          this.buttonContainer = false;
        }

        if (
          task.status === 'InTestProblem' ||
          task.status === 'InExecuteProblem'
        ) {
          this.buttonContainer = false;
          this.problemReportedDateTime = task.problemReportedDate
            ? new Date(task.problemReportedDate)
            : new Date();
          this.problemReported = true;
        }
      });
  }

  //Fetches task problem resolution details.
  fetchResolveMessage() {
    this.taskService
      .getTaskProblemDetails(this.taskId)
      .subscribe((data: any) => {
        this.buttonContainer = true;
        this.resolveMessage = data.resolveMessage;
        this.resolvingFilePath = data.resolveFilePath;
        const file = data.resolveFilePath;
        if (file) {
          const cleanedPath = file.replace(/['"]/g, '');
          this.resolvingFileName = cleanedPath.split('\\').pop() || '';
        }
      });
  }

  reportProblem() {
    const dialogRef = this.dialog.open(ReportProblemComponent, {
      width: '600px',
      height: 'auto',
      maxHeight: '70vh',
      disableClose: false,
      autoFocus: true,
      data: {
        planId: this.planId,
        taskId: this.taskId,
        sequenceId: this.sequenceId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.fileUrl) {
        this.buttonContainer = false;
        this.uploadedFileUrl = result.fileUrl;
        this.problemReportedDateTime = new Date();
        this.problemReported = true;
      } else if (result) {
        this.buttonContainer = false;
        this.problemReportedDateTime = new Date();
        this.problemReported = true;
      } else {
        this.problemReported = false;
      }
    });
  }
  //Handles button click events.
  onClick(value: string) {
    if (value === 'REPORT PROBLEM') {
      this.reportProblem();
    } else if (value === 'ACKNOWLEDGE') {
      this.acknowledge();
    } else if (value === 'COMPLETE') {
      this.taskCompletion();
    }
  }
  //Dispatches task acknowledgment action.
  acknowledge() {
    let taskAck = {
      taskId: this.taskId,
      lastChangedBy: this.user.id,
      isAcknowledged: true,
      eventTypeId: this.task.status === 'InTestDispatched' ? 1 : 3,
      retries: this.retries,
    };
    this.store.dispatch(taskAcknowledges({ taskAck: taskAck }));
  }
  //Dispatches task completion action.
  taskCompletion() {
    if (
      this.task.status === 'InTestAcknowledged' ||
      this.task.status === 'InTestProblemResolved'
    )
      this.store.dispatch(
        taskCompletion({
          taskId: this.taskId,
          status: 'InTestCompleted',
          lastChangedBy: this.user.id,
        })
      );
    if (
      this.task.status === 'InExecuteAcknowledged' ||
      this.task.status === 'InExecuteProblemResolved'
    )
      this.store.dispatch(
        taskCompletion({
          taskId: this.taskId,
          status: 'InExecuteCompleted',
          lastChangedBy: this.user.id,
        })
      );
  }

  getTaskFileUrl(): string | null {
    if (!this.taskFileURL) {
      return null;
    }
    const sanitizedPath = this.taskFileURL.replace(/\\/g, '/');
    return `${this.apiUrl}${sanitizedPath}`;
  }

  getResolvedFileUrl(): string | null {
    if (!this.resolvingFilePath) {
      return null;
    }
    const sanitizedPath = this.resolvingFilePath.replace(/\\/g, '/');
    return `${this.apiUrl}${sanitizedPath}`;
  }

  isImageFile(filePath: string): boolean {
    const extension = filePath.split('.').pop()?.toLowerCase();
    return ['png', 'jpeg', 'jpg'].includes(extension!);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
