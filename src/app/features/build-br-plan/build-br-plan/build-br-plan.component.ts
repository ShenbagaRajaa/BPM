import { Component } from '@angular/core';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SequenceAccordianComponent } from '../../../shared/sequence-accordian/sequence-accordian.component';
import { Store } from '@ngrx/store';
import { appState } from '../../../core/store/app-state/app.state';
import {
  addPlan,
  editPlan,
  getPlanById,
  updatePlanStatus,
} from '../../../core/store/plan-state/plan.action';
import { planAdd } from '../../../core/models/planAdd.model';
import {
  selectAllPlans,
  selectPlanById,
} from '../../../core/store/plan-state/plan.selector';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  getPermissionIds,
  selectUser,
} from '../../../core/store/auth-state/auth.selector';
import { selectAllSequences } from '../../../core/store/sequence-state/sequence.selector';
import {
  combineLatest,
  Observable,
  Subject,
  Subscription,
  take,
  takeUntil,
} from 'rxjs';
import { Sequence } from '../../../core/models/Sequence.model';
import { SequenceCreationComponent } from '../sequence-creation/sequence-creation.component';
import { MatDialog } from '@angular/material/dialog';
import { showSnackBar } from '../../../core/store/snackbar-state/snackbar.action';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { getSystems } from '../../../core/store/system-state/system.action';
import { selectAllPlanTypes } from '../../../core/store/plan-type-state/plan-type.selector';
import { selectAllPlanLevels } from '../../../core/store/plan-level-state/plan-level.selector';
import { selectAllSites } from '../../../core/store/site-state/site.selector';
import { selectAllSystems } from '../../../core/store/system-state/system.selector';
import { selectAllDepartments } from '../../../core/store/department-state/department.selector';
import { NewSystemCreationComponent } from '../../system-management/new-system-creation/new-system-creation.component';
import { MatIconModule } from '@angular/material/icon';
import { PlanDetailsService } from '../../../core/services/plan-details.service';
import { SearchableDropdownComponent } from '../../../shared/searchable-state-dropdown/searchable-dropdown.component';

@Component({
  selector: 'app-build-br-plan',
  standalone: true,
  imports: [
    InputFieldComponent,
    CommonModule,
    NgIf,
    NavigationbarComponent,
    MatButtonModule,
    MatRippleModule,
    SequenceAccordianComponent,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    SearchableDropdownComponent,
  ],
  templateUrl: './build-br-plan.component.html',
  styleUrl: './build-br-plan.component.css',
})
export class BuildBrPlanComponent {
  // Arrays to hold different types of plan related data
  private destroy$ = new Subject<void>();

  planTypes: { id: number; name: string }[] = [];
  planLevels: { id: number; name: string }[] = [];
  sites: { id: number; name: string; code: string }[] = [];
  departments: { id: number; name: string; code: string }[] = [];
  systems: { id: number; name: string; code: string }[] = [];
  planIdentifier = '';
  isAccordionVisible = false;
  saveButtonDisabled = true;
  pageTitle = 'Build Plan';
  planId: number = 0;
  disableForEdit: boolean = false;
  hasPermissionToBuildComplete: boolean = false;
  isBrManagerOrAdministratorRole: boolean = false;
  isBRExecutiveDirector: boolean = false;
  planName: string = '';

  allSequencesCompleted: boolean = false;
  sequencesLoaded: boolean = false;
  showBuildCompleteButton: boolean = false;
  showPromoteButton: boolean = false;
  planStatus = '';
  hasPermissionToAddSequence: boolean = false;
  hasPermissionToEditPlan: boolean = false;
  hasPermissionToAddPlan: boolean = false;
  hasPermissionToSystemCreation: boolean = false;

  buildBRPlan!: FormGroup;
  sequences$: Observable<Sequence[]>;
  user!: addUserModel;

  permissionIds: string[] = [];
  canBuildComplete: boolean = false;
  canPromoteToTest: boolean = false;
  canApprovePlan: boolean = false;
  canPromoteToExecution: boolean = false;
  showButtons: boolean = true;
  reloadTimestamp = new Date().getTime();
  filterByOptions: { id: number; name: string }[] = [
    { id: 0, name: 'Create Plan' },
  ];

  constructor(
    private store: Store<appState>,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private planService: PlanDetailsService
  ) {
    this.sequences$ = this.store.select(selectAllSequences);
  }

  ngOnInit() {
    this.loadGetData();
    this.reloadTimestamp = new Date().getTime();
  }

  loadGetData() {
    this.loadData(); // Fetch initial data
    this.initializeForm(); // Initialize the form
    this.getData(); // Get route params and other data
    this.loadPermissions(0); // Load permissions
    // Subscribe to sequences and update button visibility based on sequence status
    this.store.select(selectAllSequences).subscribe((sequences) => {
      this.sequencesLoaded = sequences.length > 0;
      this.allSequencesCompleted = sequences.every(
        (sequence) => sequence.status === 'SequenceBuildCompleted'
      );
      this.updateButtonVisibility();
    });
    // Subscribe to plan details and update plan status
    this.store.select(selectPlanById).subscribe((plan) => {
      if (plan) {
        this.planStatus = plan.planStatus;
      }
    });
    // Enable/Disable save button based on form validity
    this.buildBRPlan.statusChanges.subscribe((status) => {
      this.saveButtonDisabled = status !== 'VALID';
    });
    // Subscribe to permission changes and update permission flags
    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissions) => {
        this.permissionIds = permissions;
        this.updatePermissionFlags();
        this.updateButtonVisibility();
      });
  }
  // Initialize the form group for BR Plan
  initializeForm() {
    this.buildBRPlan = this.fb.group({
      planName: ['', [Validators.required, Validators.maxLength(60)]],
      planTypeId: ['', Validators.required],
      planLevelId: ['', Validators.required],
      siteId: [{ value: '', disabled: false }, Validators.required],
      departmentId: [{ value: '', disabled: false }, Validators.required],
      systemId: [{ value: '', disabled: false }, Validators.required],
      customerCode: ['', Validators.required],
      planDescription: ['', [Validators.required, Validators.maxLength(500)]],
      lastChangedDate: [],
      createdDate: [],
    });
  }
  // Dispatch actions to load data from the store
  loadData() {
    this.store.select(selectAllPlanTypes).subscribe(
      (datas) =>
        (this.planTypes = datas
          .filter((data) => data.status === true)
          .map((data: any) => ({
            id: data.id,
            name: data.planTypeName,
          })))
    );
    this.store.select(selectAllPlanLevels).subscribe(
      (data) =>
        (this.planLevels = data
          .filter((datas) => datas.status === true)
          .map((data1: any) => ({
            id: data1.id,
            name: data1.planLevelName,
          })))
    );
    this.store.select(selectAllSites).subscribe(
      (data) =>
        (this.sites = data
          .filter((datas) => datas.status === true)
          .map((data2: any) => ({
            id: data2.id,
            name: data2.siteName,
            code: data2.siteCode,
          })))
    );
    this.store.select(selectAllSystems).subscribe((datas) => {
      this.systems = datas
        .filter((data) => data.status === true)
        .map((data: any) => ({
          id: data.id,
          name: data.systemName,
          code: data.systemCode,
        }));
    });
    this.store.select(selectAllDepartments).subscribe(
      (datas) =>
        (this.departments = datas
          .filter((data) => data.status === true)
          .map((data: any) => ({
            id: data.id,
            name: data.departmentName,
            code: data.departmentCode,
          })))
    );
  }
  // Load permissions based on the plan ID and user role
  loadPermissions(planId: number) {
    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissions) => {
        this.permissionIds = permissions;
        this.updatePermissionFlags();
        this.updateButtonVisibility();
      });

    this.store.select(getPermissionIds).subscribe((permissionIds) => {
      this.hasPermissionToSystemCreation = permissionIds.includes('28');
      this.hasPermissionToAddSequence = permissionIds.includes('4');
      this.hasPermissionToEditPlan = permissionIds.includes('2');
      this.hasPermissionToAddPlan = permissionIds.includes('1');
      if (!permissionIds.includes('2') && planId !== 0) {
        this.buildBRPlan.get('planTypeId')?.disable();
        this.buildBRPlan.get('planLevelId')?.disable();
      } else {
        this.buildBRPlan.get('planTypeId')?.enable();
        this.buildBRPlan.get('planLevelId')?.enable();
      }
    });
  }

  // Add a new plan (either create or edit based on planId)
  addNewPlan(event: Event) {
    event.preventDefault();

    if (this.buildBRPlan.valid) {
      let createdBy;
      this.store.select(selectUser).subscribe((data) => {
        createdBy = data.user.id;
      });

      const addPlanData: planAdd = {
        ...this.buildBRPlan.value,
        siteId: Number(this.buildBRPlan.get('siteId')?.value),
        departmentId: Number(this.buildBRPlan.get('departmentId')?.value),
        systemId: Number(this.buildBRPlan.get('systemId')?.value),
        planTypeId: Number(this.buildBRPlan.get('planTypeId')?.value),
        planLevelId: Number(this.buildBRPlan.get('planLevelId')?.value),
        id: this.planId,
        createdBy: createdBy,
        lastChangedBy: createdBy,
      };

      if (this.planId) {
        if (this.planStatus !== 'PlanBuildInProgress') {
          this.store.dispatch(
            showSnackBar({
              message:
                'Plan can only be edited when status is "PlanBuildInProgress".',
              status: 'error',
            })
          );
          return;
        }

        this.store.dispatch(editPlan({ editPlan: addPlanData }));
        this.isAccordionVisible = true;
      } else {
        this.store.dispatch(addPlan({ addPlan: addPlanData }));
      }
    } else {
    }
  }
  // Add a new sequence
  addNewSequence() {
    this.dialog.open(SequenceCreationComponent, {
      data: { planId: this.planId },
    });
  }

  cancel() {
    this.router.navigate([`../home/plans`]);
  }

  private subscriptions: Subscription[] = [];
  // Get data from route params
  getData() {
    const queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        if (params['planId']) {
          this.planId = params['planId'];

          this.showButtons = !!this.planId;
          this.progressPlanDetails(Number(params['planId']));
          this.store.select(selectAllPlans).subscribe((plans: any[]) => {
            this.filterByOptions = [
              ...this.filterByOptions,
              ...plans.map((plan) => ({
                id: plan.id,
                name: plan.planName,
              })),
            ];
          });
        } else if (params['planStatus']) {
          this.planService
            .getPlanByStatus(params['planStatus'])
            .subscribe((plans: any[]) => {
              this.filterByOptions = [
                ...this.filterByOptions,
                ...plans.map((plan) => ({
                  id: plan.id,
                  name: plan.planName,
                })),
              ];
            });
        } else {
          this.planId = localStorage.getItem('selectedPlanId')
            ? Number(localStorage.getItem('selectedPlanId'))
            : 0;
          this.showButtons = !!this.planId;
          this.progressPlanDetails(this.planId);
          this.store.select(selectAllPlans).subscribe((plans: any[]) => {
            this.filterByOptions = [
              ...this.filterByOptions,
              ...plans.map((plan) => ({
                id: plan.id,
                name: plan.planName,
              })),
            ];
          });
          this.planStatus = '';
        }
      }
    );

    this.subscriptions.push(queryParamsSubscription);
  }

  removeLS() {
    localStorage.removeItem('sequenceId');
    localStorage.removeItem('taskId');
  }
  progressPlanDetails(planId: number) {
    this.planId = planId;
    if (planId !== 0) {
      localStorage.setItem('selectedPlanId', this.planId.toString());
    }
    this.showButtons = !!planId;

    if (planId !== 0) {
      this.store.dispatch(getPlanById({ id: planId }));
      this.isAccordionVisible = true;
      this.buildBRPlan.get('planName')?.disable();
      this.store
        .select(selectPlanById)
        .pipe(take(2))
        .subscribe((plan) => {
          this.pageTitle = `Edit Plan`;
          this.planIdentifier = plan.planIdentifier;

          this.disableForEdit = true;
          this.buildBRPlan.get('siteId')?.disable();

          this.buildBRPlan.patchValue({
            planName: plan.planName,
            planTypeId: plan.planTypeId,
            planLevelId: plan.planLevelId,
            siteId: plan.siteId,
            departmentId: plan.departmentId,
            systemId: plan.systemId,
            customerCode: plan.customerCode,
            planDescription: plan.planDescription,
            lastChangedDate: plan.lastChangedDate
              ? new Date(plan.lastChangedDate).toLocaleDateString()
              : null,
            createdDate: plan.createdDate
              ? new Date(plan.createdDate).toLocaleDateString()
              : null,
          });
          setTimeout(() => {
            this.buildBRPlan.get('customerCode')?.setValue(plan.customerCode)
          }, 1001);
          this.planName = plan.planName;
          if (!this.hasPermissionToEditPlan) {
            this.buildBRPlan.get('departmentId')?.disable();
            this.buildBRPlan.get('systemId')?.disable();
          }
          this.loadPermissions(planId);
          this.updatePermissionFlags();
          this.updateButtonVisibility();
        });

      
        
    } else {
      this.pageTitle = 'Create Plan';
      this.buildBRPlan.reset();
      this.planName = '';
      this.buildBRPlan.get('planName')?.enable();
      this.buildBRPlan.get('siteId')?.enable();
      this.buildBRPlan.get('departmentId')?.enable();
      this.buildBRPlan.get('systemId')?.enable();
      this.disableForEdit = false;
      this.loadPermissions(0);
      this.updatePermissionFlags();
      this.updateButtonVisibility();
    }
  }

  customerCode() {
    setTimeout(() => {
      const { systemId, departmentId, siteId } = this.buildBRPlan.value;

      const sitec = this.sites.find(
        (sitesc: { id: number; name: string; code: string }) =>
          sitesc.id === siteId
      ) ?? {
        code: '',
      };
      const departmentc = this.departments.find(
        (departmentsc: { id: number; name: string; code: string }) =>
          departmentsc.id === departmentId
      ) ?? { code: '' };
      const systemc = this.systems.find(
        (systemsc: { id: number; name: string; code: string }) =>
          systemsc.id === systemId
      ) ?? { code: '' };

      this.buildBRPlan.patchValue({
        customerCode: `${sitec.code}${departmentc.code}${systemc.code}`,
      });
    }, 1000);
  }
  // Update the visibility of buttons based on conditions
  updateButtonVisibility() {
    combineLatest([
      this.store.select(selectAllSequences),
      this.store.select(selectPlanById),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([sequences, plan]) => {
        this.sequencesLoaded = sequences.length > 0;
        this.allSequencesCompleted = sequences.every(
          (sequence) => sequence.status === 'SequenceBuildCompleted'
        );
        if (this.planId === 0) {
          this.planStatus = '';
        } else {
          this.planStatus = plan?.planStatus || '';
        }

        if (this.sequencesLoaded && this.allSequencesCompleted) {
          if (this.planStatus === 'PlanBuildInProgress') {
            this.showBuildCompleteButton = true;
            this.showPromoteButton = false;
          } else if (this.planStatus === 'PlanBuildReady') {
            this.showBuildCompleteButton = false;
            this.showPromoteButton = true;
          } else {
            this.showBuildCompleteButton = false;
            this.showPromoteButton = false;
          }
        } else {
          this.showBuildCompleteButton = false;
          this.showPromoteButton = false;
        }
      });
  }

  // Get the current user ID
  getUserId(): number {
    let userId = 0;
    this.store.select(selectUser).subscribe((data) => {
      userId = data.user.id;
      this.user = data.user;
    });
    return userId;
  }
  // Update permission flags
  updatePermissionFlags() {
    this.canBuildComplete = this.permissionIds.includes('10');
    this.canPromoteToTest = this.permissionIds.includes('11');
    this.canApprovePlan = this.permissionIds.includes('13');
    this.canPromoteToExecution = this.permissionIds.includes('14');
  }
  // Build complete action
  buildComplete() {
    if (this.canBuildComplete) {
      this.store.dispatch(
        updatePlanStatus({
          planId: this.planId,
          status: 'PlanBuildReady',
          successMessage: 'Plan build completed successfully',
        })
      );
    } else {
      this.showPermissionError();
    }
  }
  // Promote plan to test phase
  promotePlanToTest() {
    if (this.canPromoteToTest) {
      this.store.dispatch(
        updatePlanStatus({
          planId: this.planId,
          status: 'PlanReadyToBeTested',
          successMessage: 'Plan promoted to test phase successfully',
        })
      );
    } else {
      this.showPermissionError();
    }
  }
  // Approves the plan if the user has the necessary permissions
  approvePlan() {
    if (this.canApprovePlan) {
      this.store.dispatch(
        updatePlanStatus({
          planId: this.planId,
          status: 'PlanApproved',
          successMessage: 'Plan approved successfully.',
        })
      );
    } else {
      this.showPermissionError();
    }
  }
  // Promotes the plan to the execution phase if the user has the necessary permissions
  promotePlanToExecution() {
    if (this.canPromoteToExecution) {
      this.store.dispatch(
        updatePlanStatus({
          planId: this.planId,
          status: 'PlanReadyToBeExecuted',
          successMessage: 'Plan promoted to execution phase successfully.',
        })
      );
    } else {
      this.showPermissionError();
    }
  }

  showPermissionError() {
    this.store.dispatch(
      showSnackBar({
        message:
          'You do not have the required permissions to perform this action.',
        status: 'error',
      })
    );
  }

  // Extracts and formats the plan identifier into system, status, and id
  get formattedPlanIdentifier(): {
    system: string;
    status: string;
    id: string;
  } {
    if (!this.planIdentifier) return { system: '', status: '', id: '' };

    const systemMatch = this.planIdentifier.match(/^(System\d+)/);
    const idMatch = this.planIdentifier.match(/(\d+)$/);

    // Extract the middle part (status)
    const system = systemMatch ? systemMatch[1] : '';
    const id = idMatch ? idMatch[1] : '';
    const status = this.planIdentifier
      .replace(system, '')
      .replace(id, '')
      .trim();

    return {
      system,
      status,
      id,
    };
  }

  systemCreation() {
    const dialogRef = this.dialog.open(NewSystemCreationComponent, {
      data: { modelId: 1 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(getSystems());
      }
    });
  }

  ngOnDestroy() {
    this.planStatus = '';
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
