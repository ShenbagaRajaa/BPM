import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NgFor, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { distinctUntilChanged, filter, Subject, take, takeUntil } from 'rxjs';

// Components
import { StatusHighlighterComponent } from '../status-highlighter/status-highlighter.component';
import { TaskTableComponent } from '../task-table/task-table.component';
import { TaskCreationAccordionComponent } from '../../features/build-br-plan/task-creation-accordion/task-creation-accordion.component';
import { SequenceCreationComponent } from '../../features/build-br-plan/sequence-creation/sequence-creation.component';

// Models
import { Sequence } from '../../core/models/Sequence.model';

// Store Actions
import {
  dispatchSequence,
  executeSequence,
  getSequence,
  getSequences,
  getSequencesSuccess,
} from '../../core/store/sequence-state/sequence.action';
import {
  addTaskSuccess,
  editTaskSuccess,
  getTasks,
} from '../../core/store/task-state/task.action';

// Store Selectors
import { selectAllSequences } from '../../core/store/sequence-state/sequence.selector';
import {
  getPermissionIds,
  selectUser,
} from '../../core/store/auth-state/auth.selector';
import { selectPlanById } from '../../core/store/plan-state/plan.selector';

@Component({
  selector: 'app-sequence-accordian',
  standalone: true,
  imports: [
    CdkAccordionModule,
    NgFor,
    NgIf,
    StatusHighlighterComponent,
    TaskTableComponent,
    MatIconModule,
    TaskCreationAccordionComponent,
    MatButtonModule,
  ],
  templateUrl: './sequence-accordian.component.html',
  styleUrl: './sequence-accordian.component.css',
})
export class SequenceAccordianComponent implements OnInit, OnDestroy {
  @Input() planId = 0;
  @Input() module = '';
  @Input() refreshTrigger = 0;

  sequences: Sequence[] = [];
  expandedIndex = 0;
  sequenceId = 0;
  startTest = true;
  startExecute = true;
  planstatus = '';
  hasPermissionToEditSequence = false;
  reloadTimestamp = Date.now();

  private destroy$ = new Subject<void>();
  private lastActiveSequenceId: number | null = null;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.setupRouteListener();
    this.setupTaskActionListener();
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getData();
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      this.reloadTimestamp = Date.now();
      this.getData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAccordionClick(id: number, index: number): void {
    if (index !== this.expandedIndex) {
      this.expandedIndex = index;
      this.sequenceId = id;
      this.lastActiveSequenceId = id;

      this.fetchSequenceDetails(id);
    }
  }

  startExecutePlan() {
    let successMessage = '';
    if (this.module === 'testBRPlan')
      successMessage = 'Plan testing started successfully';
    if (this.module === 'executeBRPlan')
      successMessage = 'Plan execution started successfully';
    this.store
      .select(selectUser)
      .pipe(take(1))
      .subscribe((user) => {
        this.store.dispatch(
          executeSequence({
            PlanId: this.planId,
            lastChangedBy: user.user.id,
            successMessage,
          })
        );
      });
  }

  startTesting(sequence: Sequence): void {
    this.store
      .select(selectUser)
      .pipe(take(1))
      .subscribe((user) => {
        this.store.dispatch(
          dispatchSequence({
            sequenceId: sequence.id,
            lastChangedBy: user.user.id,
            planId: sequence.brPlanId,
          })
        );
      });
  }

  editNewSequence(sequenceId: number, status: string): void {
    if (status === 'SequenceBuildStarted') {
      this.dialog.open(SequenceCreationComponent, {
        data: { planId: this.planId, sequenceId },
      });
    }
  }

  private setupRouteListener(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        filter((params) => !!params['sequenceId'])
      )
      .subscribe((params) => {
        const sequenceId = Number(params['sequenceId']);
        if (sequenceId) {
          this.lastActiveSequenceId = sequenceId;
          if (this.sequences.length > 0) {
            this.updateExpandedIndex();
          }
        }
      });
  }

  private setupTaskActionListener(): void {
    this.actions$
      .pipe(ofType(addTaskSuccess, editTaskSuccess), takeUntil(this.destroy$))
      .subscribe((action: any) => {
        if (action.task?.sequenceId) {
          this.lastActiveSequenceId = action.task.sequenceId;
          if (this.sequences.length > 0) {
            this.updateExpandedIndex();
          }
        }
      });
  }

  private getData(): void {
    this.store.dispatch(getSequences({ planId: this.planId }));

    this.store.select(selectPlanById).subscribe((plan) => {
      this.planstatus = plan.planStatus;
      this.updateSequenceStatus();
    });

    this.actions$.pipe(ofType(getSequencesSuccess), take(1)).subscribe(() => {
      this.loadSequences();
      this.loadPermissions();
    });
  }

  private loadSequences(): void {
    this.store
      .select(selectAllSequences)
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe((sequences) => {
        this.sequences = sequences;

        if (sequences.length > 0) {
          if (this.lastActiveSequenceId) {
            const sequenceExists = sequences.some(
              (seq) => seq.id === this.lastActiveSequenceId
            );

            if (sequenceExists) {
              this.updateExpandedIndex();
            } else {
              this.setDefaultSequence(sequences[0]);
            }
          } else {
            this.setDefaultSequence(sequences[0]);
          }
        } else {
          this.resetSequenceState();
        }
      });
  }

  private loadPermissions(): void {
    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionIds) => {
        this.hasPermissionToEditSequence = permissionIds.includes('5');
      });
  }

  private updateExpandedIndex(): void {
    if (this.lastActiveSequenceId && this.sequences.length > 0) {
      const index = this.sequences.findIndex(
        (seq) => seq.id === this.lastActiveSequenceId
      );

      if (index !== -1) {
        this.expandedIndex = index;
        this.sequenceId = this.lastActiveSequenceId;
        this.fetchSequenceDetails(this.lastActiveSequenceId);
      }
    }
  }

  private fetchSequenceDetails(sequenceId: number): void {
    this.store.dispatch(getSequence({ sequenceId }));
    this.store.dispatch(getTasks({ sequenceId }));

    const selectedSequence = this.sequences.find(
      (seq) => seq.id === sequenceId
    );
    if (selectedSequence) {
      this.updateSequenceStatus();
    }
  }

  private setDefaultSequence(sequence: Sequence): void {
    this.expandedIndex = 0;
    this.sequenceId = sequence.id;
    this.lastActiveSequenceId = sequence.id;
    this.fetchSequenceDetails(sequence.id);
  }

  private updateSequenceStatus(): void {
    this.startTest = this.planstatus !== 'PlanReadyToBeTested';
    this.startExecute = this.planstatus !== 'PlanReadyToBeExecuted';
  }

  private resetSequenceState(): void {
    this.sequenceId = 0;
    this.startTest = true;
    this.startExecute = true;
  }
}
