import { Component, Inject, Optional } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { systemType } from '../../../core/models/systemType.model';
import { appState } from '../../../core/store/app-state/app.state';
import { selectUser } from '../../../core/store/auth-state/auth.selector';
import { showSnackBar } from '../../../core/store/snackbar-state/snackbar.action';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { SystemTypeService } from '../../../core/services/system-type.service';
import { editSystemType, getSystemType } from '../../../core/store/system-type-state/system-type.action';
import { selectSystemType } from '../../../core/store/system-type-state/system-type.selector';

@Component({
  selector: 'app-new-system-type-creation',
  standalone: true,
  imports: [NavigationbarComponent,
      InputFieldComponent,
      DropdownComponent,
      ReactiveFormsModule,
      FormsModule,
      MatSelectModule,
      MatFormFieldModule,
      MatOptionModule,
      MatButtonModule,
      MatDialogModule,],
  templateUrl: './new-system-type-creation.component.html',
  styleUrl: './new-system-type-creation.component.css'
})
export class NewSystemTypeCreationComponent {
    status: string[] = ['Active', 'Inactive'];
    saveButtonDisabled = true;
    pageTitle = 'Create New System Type';
    createsystemType!: FormGroup;
    systemTypeId : number = 0
    createdBy: number = 0;
    classValue: string =
      'md:p-4 md:pt-16 pb-16 h-screen flex flex-col bg-mBgBlue md:bg-lblue';
    backButton: boolean = true;
  
    constructor(
      private store: Store<appState>,
      private route: ActivatedRoute,
      private systemTypeService: SystemTypeService,
      private router: Router,
      @Optional()
      @Inject(MAT_DIALOG_DATA)
      public data: { modelId: number } | null = null,
      @Optional()
      private dialogRef: MatDialogRef<NewSystemTypeCreationComponent> | null = null
    ) {
      if (data?.modelId === 1) {
         // Adjust layout and button visibility if modelId equals 1
        this.classValue = 'md:p-4 pb-16  flex flex-col bg-mBgBlue md:bg-lblue';
        this.backButton = false;
      }
    }
   // Lifecycle hook: Initialize the component and load data
    ngOnInit() {
      this.route.queryParams.subscribe((params) => {
        this.systemTypeId = params['systemTypeId'];
      });
  
      this.initializeForm();
      this.getData();
    }
  // Initialize the form controls and validation
    private initializeForm() {
      this.createsystemType = new FormGroup({
        id: new FormControl(0),
        systemTypeName: new FormControl('', [Validators.required]),
        status: new FormControl('Active', [Validators.required]),
        description: new FormControl('', [Validators.maxLength(500)]),
      });
    }
   // Method to add or update a system type
    add(formGroup: FormGroup) {
      let createdBy = 0;
      if (formGroup.valid) {
        this.store.select(selectUser).subscribe((data) => {
          createdBy = data.user.id;
        });
   // Prepare the data object for a new system type
        const addSystemTypeData: systemType = {
          systemTypeName: formGroup.get('systemTypeName')?.value,
          description: formGroup.get('description')?.value,
          status: formGroup.get('status')?.value === 'Active' ? true : false,
          createdBy: createdBy,
          lastChangedBy: 0,
          id: 0,
          createdDate: new Date(),
          lastChangedDate: new Date(),
          isDeleted: false
        };
   // Prepare the data object for editing an existing system type
        let updateSystemTypeData: systemType = {
          id: formGroup.get('id')?.value,
          systemTypeName: formGroup.get('systemTypeName')?.value,
          status: formGroup.get('status')?.value === 'Active' ? true : false,
          description: formGroup.get('description')?.value, 
          lastChangedBy: createdBy,
          createdBy: createdBy,
          createdDate: new Date(),
          lastChangedDate: new Date(),
          isDeleted: false
        };
    // Check if we are editing or creating a new system type
        if (this.systemTypeId) {
          this.store.dispatch(editSystemType({ editSystemType: updateSystemTypeData }));
        } else {
          this.systemTypeService.addSystemType(addSystemTypeData).subscribe({
            next: () => {
              this.store.dispatch(showSnackBar({
                message: 'System Type added successfully',
                status: 'success',
              }),);
              
              if (this.data?.modelId === 1 && this.dialogRef) {
                this.dialogRef.close(true);
              } else {
                this.router.navigate([`../home/systemTypeManagement/`]);
              }
            },
            error: (error) => {
              this.store.dispatch(showSnackBar({ message: error.error.detail }));
            },
          });
        }
      }
    }
    // Method to handle the 'Cancel' action
    back() {
      if (this.data?.modelId === 1 && this.dialogRef) {
        this.dialogRef.close();
      } else {
        this.router.navigate(['../home/systemTypeManagement/']);
      }
    }
    // Lifecycle hook: Update data on changes
    ngOnChanges() {
      this.getData();
    }
   // Method to fetch existing data when editing an existing system type
    getData() {
      this.store.select(selectUser).subscribe((data) => {
        this.createdBy = data.user.id;
      });

      if (this.systemTypeId) {
        this.pageTitle = 'Edit System Type';
        this.store.dispatch(getSystemType({ systemTypeId: this.systemTypeId }));
  
        this.store.select(selectSystemType).subscribe((foundsystemType) => {
  
          if (foundsystemType) {
            setTimeout(() => {
              this.createsystemType.patchValue({
                id: foundsystemType.id,
                systemTypeName: foundsystemType.systemTypeName,
                status: foundsystemType.status ? 'Active' : 'Inactive',
                description: foundsystemType.description || '', 
              });
              this.saveButtonDisabled = true;
            }, 100);
          }
        });
      }
  
      this.createsystemType.statusChanges.subscribe((status) => {
        this.saveButtonDisabled = status !== 'VALID';
      });
    }
  }

