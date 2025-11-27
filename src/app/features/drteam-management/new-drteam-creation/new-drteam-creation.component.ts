import { Component, Inject, Optional } from '@angular/core';
import { DrteamService } from '../../../core/services/drteam.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { drTeam } from '../../../core/models/drTeam.model';
import { appState } from '../../../core/store/app-state/app.state';
import { selectUser } from '../../../core/store/auth-state/auth.selector';
import {
  editDRTeam,
  getDRTeam,
  getDRTeams,
} from '../../../core/store/drTeam-state/drTeam.action';
import { selectDRTeam } from '../../../core/store/drTeam-state/drTeam.selector';
import { showSnackBar } from '../../../core/store/snackbar-state/snackbar.action';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-new-drteam-creation',
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
    MatDialogModule,
  ],
  templateUrl: './new-drteam-creation.component.html',
  styleUrl: './new-drteam-creation.component.css',
})
export class NewDrteamCreationComponent {
  status: string[] = ['Active', 'Inactive'];
  saveButtonDisabled = true;
  pageTitle = 'Create New DR Team';
  createDRTeam!: FormGroup;
  drTeamId: number = 0;
  createdBy: number = 0;
  classValue: string =
    'md:p-4 pb-16 h-screen flex flex-col bg-mBgBlue md:bg-lblue';
  insideDivStyle: string =
    'w-full bg-white shadow-lg p-4 pb-64 md:block flex-grow';
  backButton: boolean = true;

  constructor(
    private store: Store<appState>,
    private route: ActivatedRoute,
    private drTeamService: DrteamService,
    private router: Router,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { modelId: number } | null = null,
    @Optional()
    private dialogRef: MatDialogRef<NewDrteamCreationComponent> | null = null
  ) {
    if (data?.modelId === 1) {
      this.classValue =
        'md:p-4 p-4 flex flex-col bg-mBgBlue md:bg-lblue w-[300px] md:w-auto tablet:w-auto mobileLandscape:w-auto';
      this.insideDivStyle = 'w-full bg-white shadow-lg p-4 md:block flex-grow';
      this.backButton = false;
    }
  }

  ngOnInit() {
    // Retrieve query parameters (DR team ID if editing)
    this.route.queryParams.subscribe((params) => {
      this.drTeamId = params['drTeamId'];
    });

    this.initializeForm();
    this.getData();
  }

  // Initialize the form with default values and validation
  private initializeForm() {
    this.createDRTeam = new FormGroup({
      id: new FormControl(0),
      drTeamName: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9_\\s]+$'),
      ]),
      status: new FormControl('Active', [Validators.required]),
      description: new FormControl('', [Validators.maxLength(500)]),
    });
  }

  add(formGroup: FormGroup) {
    let createdBy = 0;
    if (formGroup.valid) {
      // Get the current logged-in user ID
      this.store.select(selectUser).subscribe((data) => {
        createdBy = data.user.id;
      });
      // Create new DR Team object
      const addDRTeamData: drTeam = {
        teamName: formGroup.get('drTeamName')?.value,
        status: formGroup.get('status')?.value === 'Active' ? true : false,
        createdBy: createdBy,
        lastChangedBy: 0,
        id: 0,
        description: formGroup.get('description')?.value,
      };
      // Update existing DR Team object
      let updateDRTeamData: drTeam = {
        id: formGroup.get('id')?.value,
        teamName: formGroup.get('drTeamName')?.value,
        status: formGroup.get('status')?.value === 'Active' ? true : false,
        lastChangedBy: createdBy,
        createdBy: createdBy,
        description: formGroup.get('description')?.value,
      };

      if (this.drTeamId) {
        // Dispatch action to edit DR team if an ID exists
        this.store.dispatch(editDRTeam({ editDRTeam: updateDRTeamData }));
      } else {
        this.drTeamService.addDRTeam(addDRTeamData).subscribe({
          next: () => {
            this.store.dispatch(
              showSnackBar({
                message: 'DR Team added successfully',
                status: 'success',
              })
            );
            if (this.data?.modelId === 1 && this.dialogRef) {
              this.dialogRef.close(true);
              this.store.dispatch(getDRTeams());
            } else {
              this.router.navigate([`../home/drTeamManagement/`]);
            }
          },
          error: (error) => {
            this.store.dispatch(showSnackBar({ message: error.error.detail }));
          },
        });
      }
    }
  }
  // Navigate back or close dialog
  back() {
    if (this.data?.modelId === 1 && this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['../home/drTeamManagement/']);
    }
  }

  ngOnChanges() {
    // Fetch data if component changes
    this.getData();
  }

  getData() {
    // Retrieve logged-in user ID
    this.store.select(selectUser).subscribe((data) => {
      this.createdBy = data.user.id;
    });

    if (this.drTeamId) {
      this.pageTitle = 'Edit DR Team';
      this.store.dispatch(getDRTeam({ drTeamId: this.drTeamId }));
      // Subscribe to store and populate form when data is available
      this.store.select(selectDRTeam).subscribe((foundDRTeam) => {
        if (foundDRTeam) {
          setTimeout(() => {
            this.createDRTeam.patchValue({
              id: foundDRTeam.id,
              drTeamName: foundDRTeam.teamName,
              status: foundDRTeam.status ? 'Active' : 'Inactive',
              description: foundDRTeam.description || '',
            });
            this.saveButtonDisabled = true;
          }, 100);
        }
      });
    }
    // Disable save button unless form is valid
    this.createDRTeam.statusChanges.subscribe((status) => {
      this.saveButtonDisabled = status !== 'VALID';
    });
  }
}
