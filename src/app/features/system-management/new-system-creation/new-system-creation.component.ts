import { Component, Inject, Optional } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { system } from '../../../core/models/system.model';
import { appState } from '../../../core/store/app-state/app.state';
import {
  getPermissionIds,
  selectUser,
} from '../../../core/store/auth-state/auth.selector';
import {
  editSystem,
  getSystem,
  getSystems,
} from '../../../core/store/system-state/system.action';
import { selectSystem } from '../../../core/store/system-state/system.selector';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { NgIf } from '@angular/common';
import { showSnackBar } from '../../../core/store/snackbar-state/snackbar.action';
import { SystemService } from '../../../core/services/system.service';

@Component({
  selector: 'app-new-system-creation',
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
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    NgIf,
  ],
  templateUrl: './new-system-creation.component.html',
  styleUrl: './new-system-creation.component.css',
})
export class NewSystemCreationComponent {
  status: string[] = ['Active', 'Inactive'];
  saveButtonDisabled = true;
  pageTitle = 'Create New System';
  createSystem!: FormGroup;
  createdBy: number = 0;
  systemId: number = 0;
  hasPermissionToAddSite: boolean = false;
  hasPermissionToAddSystemType: boolean = false;
  hasPermissionToAddDepartment: boolean = false;
  classValue: string =
    'md:p-4 pb-16 h-screen flex flex-col bg-mBgBlue tablet:bg-lblue md:bg-lblue tablet:px-4';
  insideDivStyle: string =
    'w-full bg-white shadow-lg p-4 md:block flex-grow pb-64';
  backButton: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<appState>,
    private route: ActivatedRoute,
    private router: Router,
    private systemService: SystemService,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { modelId: number } | null = null,
    @Optional()
    private dialogRef: MatDialogRef<NewSystemCreationComponent> | null = null
  ) {
    // Modify UI based on dialog context
    if (data?.modelId === 1) {
      this.classValue =
        'md:p-4 tablet:p-4 p-4 flex flex-col bg-mBgBlue md:bg-lblue w-[300px] md:w-auto tablet:w-auto mobileLandscape:w-auto';
      this.insideDivStyle = 'w-full bg-white shadow-lg p-4 md:block flex-grow';
      this.backButton = false;
    }
  }

  ngOnInit() {
    // Extract systemId from route query params
    this.route.queryParams.subscribe((params) => {
      this.systemId = params['systemId'];
    });

    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissionIds) => {
        this.hasPermissionToAddDepartment = permissionIds.includes('25');
        this.hasPermissionToAddSite = permissionIds.includes('22');
        this.hasPermissionToAddSystemType = permissionIds.includes('63');
      });

    this.initializeForm();
    this.getData();
  }

  // Set up the reactive form
  private initializeForm() {
    this.createSystem = new FormGroup({
      id: new FormControl(0),
      systemName: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9_\\s]+$'),
      ]),
      systemCode: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9_\\s]+$'),
      ]),
      status: new FormControl('Active', [Validators.required]),
      description: new FormControl('', [Validators.maxLength(500)]),
    });
  }

  // Method to add a new system or update an existing system
  add(formGroup: FormGroup) {
    let createdBy = 0;
    if (formGroup.valid) {
      this.store.select(selectUser).subscribe((data) => {
        createdBy = data.user.id;
      });

      const addSystemData: system = {
        id: formGroup.get('id')?.value || 0,
        systemName: formGroup.get('systemName')?.value,
        systemCode: formGroup.get('systemCode')?.value,
        status: formGroup.get('status')?.value === 'Active' ? true : false,
        description: formGroup.get('description')?.value,
        createdby: createdBy,
        createdDate: new Date(),
        lastChangedBy: createdBy,
        lastChangedDate: new Date(),
      };

      // Dispatch action to update or add system
      if (this.systemId) {
        this.store.dispatch(editSystem({ editSystem: addSystemData }));
      } else {
        this.systemService.addSystem(addSystemData).subscribe({
          next: () => {
            this.store.dispatch(
              showSnackBar({
                message: 'System added successfully',
                status: 'success',
              })
            );
            if (this.data?.modelId === 1 && this.dialogRef) {
              this.dialogRef.close(true);
              this.store.dispatch(getSystems());
            } else {
              this.router.navigate([`../home/systemManagement/`]);
            }
          },
          error: (error: any) => {
            this.store.dispatch(showSnackBar({ message: error.error.detail }));
          },
        });
      }
    }
  }
  // Navigate back to the previous page or close dialog
  back() {
    if (this.data?.modelId === 1 && this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['../home/systemManagement/']);
    }
  }

  // Method to handle state change in the form
  onStateChange(selectedStateId: string) {
    this.createSystem.patchValue({ state: selectedStateId });
  }

  // Fetch necessary data (user, site, system details)
  getData() {
    this.store.select(selectUser).subscribe((data) => {
      this.createdBy = data.user.id;
    });

    if (this.systemId) {
      this.pageTitle = 'Edit System';
      this.store.dispatch(getSystem({ systemId: this.systemId }));

      this.store.select(selectSystem).subscribe((foundSystem) => {
        if (foundSystem) {
          this.createSystem.get('siteId')?.disable();
          setTimeout(() => {
            this.createSystem.patchValue({
              id: foundSystem.id,
              systemName: foundSystem.systemName,
              systemCode: foundSystem.systemCode,

              status: foundSystem.status ? 'Active' : 'Inactive',
              description: foundSystem.description || '',
            });
            this.saveButtonDisabled = true;
          }, 100);
        }
      });
    }

    // Watch form status
    this.createSystem.statusChanges.subscribe((status) => {
      this.saveButtonDisabled = status !== 'VALID';
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
