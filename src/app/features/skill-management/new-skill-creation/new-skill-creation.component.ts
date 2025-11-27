import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Optional,
} from '@angular/core';
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
import {
  editSkill,
  getSkill,
} from '../../../core/store/skills-state/skills.action';
import { selectSkill } from '../../../core/store/skills-state/skills.selector';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { drTeam } from '../../../core/models/drTeam.model';
import { drSkill } from '../../../core/models/drSkill.model';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SkillsService } from '../../../core/services/skills.service';
import { showSnackBar } from '../../../core/store/snackbar-state/snackbar.action';
import { getDRTeams } from '../../../core/store/drTeam-state/drTeam.action';
import { selectAllDRTeams } from '../../../core/store/drTeam-state/drTeam.selector';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-skill-creation',
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
    CommonModule,
    MatDialogModule,
  ],
  templateUrl: './new-skill-creation.component.html',
  styleUrl: './new-skill-creation.component.css',
})
export class NewSkillCreationComponent implements OnInit {
  statusOptions: string[] = ['Active', 'Inactive'];
  saveButtonDisabled = true;
  pageTitle = 'Create DR Skill';
  createSkillForm!: FormGroup;
  skillId: number = 0;
  createdBy: number = 0;
  drTeams: drTeam[] = [];
  drTeamDropdownOptions: string[] = [];
  drTeamMap: Map<string, number> = new Map();
  classValue: string =
    'md:p-4 pb-16 h-screen flex flex-col bg-mBgBlue md:bg-lblue';
  insideDivStyle: string =
    'w-full bg-white shadow-lg p-4 pb-64 md:block flex-grow';
  backButton: boolean = true;

  constructor(
    private store: Store<appState>,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private skillService: SkillsService,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { modelId: number } | null = null,
    @Optional()
    private dialogRef: MatDialogRef<NewSkillCreationComponent> | null = null
  ) {
    if (data?.modelId === 1) {
      this.classValue =
        'md:p-4 p-4 flex flex-col bg-mBgBlue md:bg-lblue  w-[300px] md:w-auto tablet:w-auto mobileLandscape:w-auto';
      this.insideDivStyle = 'w-full bg-white shadow-lg p-4 md:block flex-grow';
      this.backButton = false;
    }
  }
  // OnInit lifecycle hook: set up initial data
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.skillId = params['id'] || 0;
    });

    this.initializeForm();
    this.getUserDetails();
    this.loadDropdownData();

    this.createSkillForm.statusChanges.subscribe((status) => {
      this.saveButtonDisabled = status !== 'VALID';
    });
  }
  // Get user details from the store (e.g., the user who is creating/updating the skill)
  private getUserDetails() {
    this.store.select(selectUser).subscribe((user) => {
      if (user) {
        this.createdBy = user.user.id;
      }
    });
  }
  // Initialize the form group with validations
  private initializeForm() {
    this.createSkillForm = new FormGroup({
      id: new FormControl(0),
      skillName: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9_\\s]+$'),
      ]),

      status: new FormControl('Active', [Validators.required]),
      description: new FormControl('', [Validators.maxLength(500)]),
    });
  }
  // Handle DR team selection change
  onTeamSelectionChange(event: any) {
    const selectedTeamName = event?.value;
    if (selectedTeamName) {
      this.createSkillForm.patchValue({
        drTeamId: selectedTeamName,
      });
    }
  }

  cancel() {
    if (this.data?.modelId === 1 && this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['../home/skillManagement']);
    }
  }

  // Load DR Teams and set up team options for dropdown
  private loadDropdownData() {
    this.store.dispatch(getDRTeams());
    this.store.select(selectAllDRTeams).subscribe((data) => {
      if (data) {
        this.drTeams = data.filter((data) => data.status === true);
        this.drTeamDropdownOptions = this.drTeams.map((team) => team.teamName);
        this.drTeams.forEach((team) => {
          this.drTeamMap.set(team.teamName, team.id);
        });

        if (this.skillId) {
          this.pageTitle = 'Update DR Skill';
          this.loadSkillForEdit();
        } else {
          this.pageTitle = 'Create DR Skill';
        }
      }
    });
  }
  // Load existing skill data for editing

  private loadSkillForEdit() {
    if (this.skillId) {
      this.store.dispatch(getSkill({ skillId: this.skillId }));

      this.store.select(selectSkill).subscribe((foundSkill) => {
        if (foundSkill) {
          this.createSkillForm.patchValue({
            id: foundSkill.id,
            skillName: foundSkill.skillName,
            description: foundSkill.description || '',
            status: foundSkill.status === true ? 'Active' : 'Inactive',
          });
          this.saveButtonDisabled = true;
        }
      });
    }
  }
  // Save or update the skill data
  saveSkill() {
    if (this.createSkillForm.valid) {
      const formValue = this.createSkillForm.value;
      const selectedTeamName = formValue.drTeamId;
      const teamId = this.drTeamMap.get(selectedTeamName) || 0;

      const skillData: drSkill = {
        id: this.skillId || 0,
        drTeamId: teamId,
        skillName: formValue.skillName,
        status: formValue.status === 'Active',
        isDeleted: false,
        createdBy: this.createdBy,
        description: formValue.description,
        createdDate: new Date(),
        lastChangedBy: this.createdBy,
        lastChangedDate: new Date(),
      };

      if (this.skillId) {
        this.store.dispatch(editSkill({ updatedSkill: skillData }));
      } else {
        this.skillService.addSkill(skillData).subscribe({
          next: () => {
            this.store.dispatch(
              showSnackBar({
                message: 'DR Skill added successfully',
                status: 'success',
              })
            );

            if (this.data?.modelId === 1 && this.dialogRef) {
              this.dialogRef.close(true);
            } else {
              this.router.navigate(['../home/skillManagement']);
            }
          },
          error: (error) => {
            this.store.dispatch(showSnackBar({ message: error.error.detail }));
          },
        });
      }
    }
  }
}
