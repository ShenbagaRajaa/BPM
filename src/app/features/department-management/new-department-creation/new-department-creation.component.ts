import { Component, OnInit, Inject, Optional } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { appState } from '../../../core/store/app-state/app.state';
import { department } from '../../../core/models/department.model';
import {
  editDepartment,
  getDepartment,
} from '../../../core/store/department-state/department.action';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { selectUser } from '../../../core/store/auth-state/auth.selector';
import { selectDepartment } from '../../../core/store/department-state/department.selector';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DepartmentService } from '../../../core/services/department.service';
import { showSnackBar } from '../../../core/store/snackbar-state/snackbar.action';

@Component({
  selector: 'app-new-department-creation',
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
  templateUrl: './new-department-creation.component.html',
  styleUrl: './new-department-creation.component.css',
})
export class NewDepartmentCreationComponent implements OnInit {
  departmentForm!: FormGroup;
  statusOptions: string[] = ['Active', 'Inactive'];
  saveButtonDisabled = true;
  pageTitle = 'Create New Department';
  departmentId: number = 0;
  lastChangedBy: number = 0;
  createdBy: number = 0;
  status: boolean = false;
  classValue: string =
    'md:p-4 pb-16 mobileLandscp h-screen flex flex-col bg-mBgBlue md:bg-lblue ';
  backButton: boolean = true;

  constructor(
    private store: Store<appState>,
    private router: Router,
    private route: ActivatedRoute,
    private departmentService: DepartmentService,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { modelId: number } | null = null,
    @Optional()
    private dialogRef: MatDialogRef<NewDepartmentCreationComponent> | null = null
  ) {
    // If the component is opened as a modal (modelId === 1), adjust the layout and hide the back button
    if (data?.modelId === 1) {
      this.classValue = 'md:p-4 pb-16  flex flex-col bg-mBgBlue md:bg-lblue';
      this.backButton = false;
    }
  }

  ngOnInit() {
    // Retrieve departmentId from query parameters (used for editing an existing department)
    this.route.queryParams.subscribe((params) => {
      this.departmentId = params['departmentId'];
    });

    this.initializeForm();

    if (this.departmentId) {
      this.pageTitle = 'Edit Department';
      this.loadDepartmentData();
    }
  }

  //  Initializes the form with validation rules.

  private initializeForm() {
    this.departmentForm = new FormGroup({
      id: new FormControl(0),
      departmentName: new FormControl('', [
        Validators.required,
        Validators.maxLength(45),
      ]),
      departmentCode: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9_\\s]+$'),
      ]),
      description: new FormControl('', [Validators.maxLength(500)]),
      status: new FormControl('Active', [Validators.required]),
    });

    this.departmentForm.statusChanges.subscribe((status) => {
      this.saveButtonDisabled = status !== 'VALID';
    });
  }

  // Loads department data if editing an existing department.

  loadDepartmentData() {
    this.store.dispatch(getDepartment({ departmentId: this.departmentId }));

    this.store.select(selectDepartment).subscribe((departmentData) => {
      if (departmentData) {
        this.departmentForm.patchValue({
          id: departmentData.id,
          departmentName: departmentData.departmentName,
          departmentCode: departmentData.departmentCode,
          status: departmentData.status ? 'Active' : 'Inactive',
          description: departmentData.description || '',
        });
        // this.saveButtonDisabled = true;
        this.departmentForm.statusChanges.subscribe((status) => {
          this.saveButtonDisabled = status !== 'VALID';
        });
        this.saveButtonDisabled = true;
      }
    });
  }

  // Saves the department (either creates a new one or edits an existing one).

  saveDepartment() {
    if (this.departmentForm.valid) {
      this.store.select(selectUser).subscribe((data) => {
        this.lastChangedBy = data.user.id;
        this.createdBy = data.user.id;
      });

      const currentDate = new Date().toISOString();
      const departmentData: department = {
        id: this.departmentId || 0,
        departmentName: this.departmentForm.get('departmentName')?.value,
        departmentCode: this.departmentForm.get('departmentCode')?.value,
        description: this.departmentForm.get('description')?.value,
        status:
          this.departmentForm.get('status')?.value === 'Active' ? true : false,
        createdBy: this.createdBy,
        lastChangedBy: this.lastChangedBy,
        lastChangedDate: currentDate,
      };

      if (this.departmentId) {
        this.store.dispatch(editDepartment({ editDepartment: departmentData }));
      } else {
        // this.store.dispatch(addDepartment({ addDepartment: departmentData }));
        this.departmentService.addDepartment(departmentData).subscribe({
          next: () => {
            this.store.dispatch(
              showSnackBar({
                message: 'Department added successfully',
                status: 'success',
              })
            );

            if (this.data?.modelId === 1 && this.dialogRef) {
              this.dialogRef.close(true);
            } else {
              this.router.navigate([`../home/departmentManagement/`]);
            }
          },
          error: (error) => {
            this.store.dispatch(showSnackBar({ message: error.error.detail }));
          },
        });
      }
    }
  }

  //Cancels the operation and navigates back.

  cancel() {
    if (this.data?.modelId === 1 && this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['/home/departmentManagement']);
    }
  }
}
