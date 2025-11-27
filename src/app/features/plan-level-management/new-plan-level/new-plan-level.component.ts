import { ChangeDetectorRef, Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { appState } from '../../../core/store/app-state/app.state';
import { selectUser } from '../../../core/store/auth-state/auth.selector';
import {
  addPlanLevel,
  editPlanLevel,
  getPlanLevel,
} from '../../../core/store/plan-level-state/plan-level.action';
import { selectPlanLevel } from '../../../core/store/plan-level-state/plan-level.selector';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';

@Component({
  selector: 'app-new-plan-level',
  standalone: true,
  imports: [
    NavigationbarComponent,
    InputFieldComponent,
    DropdownComponent,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatButtonModule,
  ],
  templateUrl: './new-plan-level.component.html',
  styleUrl: './new-plan-level.component.css',
})
export class NewPlanLevelComponent {
  statusOptions: string[] = ['Active', 'Inactive'];
  saveButtonDisabled = true;
  pageTitle = 'Create Plan Level';
  createPlanLevelForm!: FormGroup;
  planLevelId: number = 0;
  createdBy: number = 0;

  constructor(
    private store: Store<appState>,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Subscribe to route query parameters to get planLevelId if present
    this.route.queryParams.subscribe((params) => {
      this.planLevelId = params['planLevelId'];
    });

    this.initializeForm();
    this.getUserDetails();
    this.getData();
  }
  // Method to initialize the form with necessary form controls and validators
  private initializeForm() {
    this.createPlanLevelForm = new FormGroup({
      id: new FormControl(0),
      planLevelName: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      status: new FormControl('Active', [Validators.required]),
      description: new FormControl('', [Validators.maxLength(500)]),
    });

    this.createPlanLevelForm.statusChanges.subscribe((status) => {
      this.saveButtonDisabled = status !== 'VALID';
    });
  }
  getUserDetails() {
    this.store.select(selectUser).subscribe((data) => {
      this.createdBy = data.user.id;
    });
  }
  // Method to save the plan level data (either add or edit)
  savePlanLevel() {
    if (this.createPlanLevelForm.valid) {
      const planLevelData = {
        id: this.createPlanLevelForm.get('id')?.value,
        planLevelName: this.createPlanLevelForm.get('planLevelName')?.value,
        status: this.createPlanLevelForm.get('status')?.value === 'Active',
        description: this.createPlanLevelForm.get('description')?.value,
        createdBy: this.createdBy,
        createdDate: new Date(),

        lastChangedBy: this.createdBy,
        lastChangedDate: new Date(),
      };
      // Dispatch the appropriate action based on whether it's a new or editing plan level
      if (this.planLevelId) {
        this.store.dispatch(editPlanLevel({ editPlanLevel: planLevelData }));
      } else {
        this.store.dispatch(addPlanLevel({ addPlanLevel: planLevelData }));
      }
    }
  }
  // Method to handle cancel action, navigate back to the plan level management page
  cancel() {
    this.router.navigate(['../home/planLevelManagement']);
  }
  // Method to handle state change from dropdown
  onStateChange(selectedPlanLevelId: string) {
    this.createPlanLevelForm.patchValue({ state: selectedPlanLevelId });
  }
  // Lifecycle hook that triggers when input or data-bound properties change
  ngOnChanges() {
    this.getData();
  }

  getData() {
    // Fetch user details (createdBy user id)
    this.store.select(selectUser).subscribe((data) => {
      this.createdBy = data.user.id;
    });

    if (this.planLevelId) {
      this.pageTitle = 'Edit Plan Level';
      // Dispatch action to get the plan level data by planLevelId
      this.store.dispatch(getPlanLevel({ planLevelId: this.planLevelId }));

      this.store.select(selectPlanLevel).subscribe((foundPlanLevel) => {
        if (foundPlanLevel) {
          setTimeout(() => {
            this.createPlanLevelForm.patchValue({
              id: foundPlanLevel.id,
              planLevelName: foundPlanLevel.planLevelName,
              status: foundPlanLevel.status ? 'Active' : 'Inactive',
              description: foundPlanLevel.description || '',
            });
            this.saveButtonDisabled = true;
          }, 100);
        }
      });
    }
    // Subscribe to form statusChanges to disable save button unless form is valid
    this.createPlanLevelForm.statusChanges.subscribe((status) => {
      this.saveButtonDisabled = status !== 'VALID';
    });
  }
}
