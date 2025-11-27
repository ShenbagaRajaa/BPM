import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { appState } from '../../../core/store/app-state/app.state';
import { selectUser } from '../../../core/store/auth-state/auth.selector';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import {
  addPlanType,
  editPlanType,
  getPlanType,
} from '../../../core/store/plan-type-state/plan-type.action';
import { selectPlanType } from '../../../core/store/plan-type-state/plan-type.selector';

@Component({
  selector: 'app-new-plan-type-creation',
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
  templateUrl: './new-plan-type-creation.component.html',
  styleUrl: './new-plan-type-creation.component.css',
})
export class NewPlanTypeCreationComponent {
  statusOptions: string[] = ['Active', 'Inactive'];
  saveButtonDisabled = true;
  pageTitle = 'Create Plan Type';
  createPlanTypeForm!: FormGroup;
  planTypeId: number = 0;
  createdBy: number = 0;
  lastChangedBy: number = 0;

  constructor(
    private store: Store<appState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  // On initialization, subscribe to route params, initialize the form, get user details, and fetch plan type data if editing
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.planTypeId = params['planTypeId'];
    });

    this.initializeForm();
    this.getUserDetails();
    this.getData();
  }
  // Initialize the form group with controls and validators
  private initializeForm() {
    this.createPlanTypeForm = new FormGroup({
      id: new FormControl(0),
      planTypeName: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
      status: new FormControl('Active', [Validators.required]),
      description: new FormControl('', [Validators.maxLength(500)]),
    });

    this.createPlanTypeForm.statusChanges.subscribe((status) => {
      this.saveButtonDisabled = status !== 'VALID';
    });
  }
  // Get user details from the store
  getUserDetails() {
    this.store.select(selectUser).subscribe((data) => {
      this.createdBy = data.user.id;
    });
  }
  // Save the plan type (either create or edit based on planTypeId)
  savePlanType() {
    if (this.createPlanTypeForm.valid) {
      const planTypeData = {
        id: this.createPlanTypeForm.get('id')?.value,
        planTypeName: this.createPlanTypeForm.get('planTypeName')?.value,
        status: this.createPlanTypeForm.get('status')?.value === 'Active',
        description: this.createPlanTypeForm.get('description')?.value,
        createdBy: this.createdBy,
        createdDate: new Date(),
        lastChangedBy: this.createdBy,
        lastChangedDate: new Date(),
      };
      // Dispatch appropriate action based on whether we are editing or adding a new plan type
      if (this.planTypeId) {
        this.store.dispatch(editPlanType({ editPlanType: planTypeData }));
      } else {
        this.store.dispatch(addPlanType({ addPlanType: planTypeData }));
      }
    }
  }
  // Cancel and navigate back to the plan type management page
  cancel() {
    this.router.navigate([`../home/planTypeManagement/`]);
  }
  // Handle state change from the dropdown (for state selection)
  onStateChange(selectedPlanTypeId: string) {
    this.createPlanTypeForm.patchValue({ state: selectedPlanTypeId });
  }
  // Handle changes (usually for re-fetching data)
  ngOnChanges() {
    this.getData();
  }
  // Fetch data (either for new or editing)
  getData() {
    this.store.select(selectUser).subscribe((data) => {
      this.createdBy = data.user.id;
    });
    // If we're editing an existing plan type, fetch its data
    if (this.planTypeId) {
      this.pageTitle = 'Edit Plan Type';

      this.store.dispatch(getPlanType({ planTypeId: this.planTypeId }));

      this.store.select(selectPlanType).subscribe((foundPlanType) => {
        if (foundPlanType) {
          setTimeout(() => {
            this.createPlanTypeForm.patchValue({
              id: foundPlanType.id,
              planTypeName: foundPlanType.planTypeName,
              status: foundPlanType.status ? 'Active' : 'Inactive',
              description: foundPlanType.description || '',
            });
            this.saveButtonDisabled = true;
          }, 100);
        }
      });
    }
    // Enable/disable the save button based on form validity
    this.createPlanTypeForm.statusChanges.subscribe((status) => {
      this.saveButtonDisabled = status !== 'VALID';
    });
  }
}
