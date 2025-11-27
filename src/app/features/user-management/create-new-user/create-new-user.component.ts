import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { NgIf, NgClass } from '@angular/common';

import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { ImageUploadComponent } from '../../../shared/image-upload/image-upload.component';

import { appState } from '../../../core/store/app-state/app.state';
import { addUserModel } from '../../../core/models/UserCreationTemp.model';
import { role } from '../../../core/models/role.model';
import { country } from '../../../core/models/country.model';
import { state } from '../../../core/models/state.model';
import { city } from '../../../core/models/city.model';
import { planType } from '../../../core/models/planType.model';

import {
  addUser,
  addUserSuccess,
  getUserByEmail,
  updateUser,
  updateUserSuccess,
} from '../../../core/store/user-state/user.action';
import { selectUserByEmail } from '../../../core/store/user-state/user.selector';
import {
  getPermissionIds,
  selectUser,
} from '../../../core/store/auth-state/auth.selector';

import {
  loadCountry,
  loadStateByCountry,
  loadCityByState,
} from '../../../core/store/country-state/country.action';
import {
  getCountry,
  getStateByCountry,
  getCityByState,
} from '../../../core/store/country-state/country.selector';

import { getDRTeams } from '../../../core/store/drTeam-state/drTeam.action';
import { selectAllDRTeams } from '../../../core/store/drTeam-state/drTeam.selector';

import { getSkills } from '../../../core/store/skills-state/skills.action';
import { selectAllSkills } from '../../../core/store/skills-state/skills.selector';

import { getRoles } from '../../../core/store/role-state/role.action';
import { selectAllRoles } from '../../../core/store/role-state/role.selector';

import { uniquePhoneNumber } from '../../../core/Validation/uniquePhoneNumbers';
import { uniqueEmail } from '../../../core/Validation/uniqueEmail';

import { NewDrteamCreationComponent } from '../../drteam-management/new-drteam-creation/new-drteam-creation.component';
import { NewSkillCreationComponent } from '../../skill-management/new-skill-creation/new-skill-creation.component';
import { MatIconModule } from '@angular/material/icon';
import { SearchableDropdownComponent } from '../../../shared/searchable-state-dropdown/searchable-dropdown.component';

@Component({
  selector: 'app-create-new-user',
  standalone: true,
  imports: [
    NavigationbarComponent,
    InputFieldComponent,
    DropdownComponent,
    ReactiveFormsModule,
    FormsModule,
    ImageUploadComponent,
    NgIf,
    NgClass,
    MatIconModule,
    SearchableDropdownComponent,
  ],
  templateUrl: './create-new-user.component.html',
  styleUrl: './create-new-user.component.css',
})
export class CreateNewUserComponent {
  planTypes: planType[] = [];
  drTeamIds: {id:number, name: string}[] = [];
  drSkill: {id:string, name: string}[] = [];
  city: city[] = [];
  state: state[] = [];
  country: country[] = [];
  role: role[] = [];
  zipcodes: string[] = [];
  status: string[] = ['Active', 'Inactive'];

  saveButtonDisabled = true;
  email = '';
  pageTitle = 'Create New User';
  profilePath = '';
  redirecting = false;
  profile: File | null = null;

  createUser!: FormGroup;
  createdBy = 0;
  countryCode = 0;
  profileValid = false;

  hasPermissionToCreateDRSkill = false;
  hasPermissionToCreateDRTeam = false;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<appState>,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private action$: Actions
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadInitialData();
    this.editUserData();

    this.action$
      .pipe(takeUntil(this.destroy$), ofType(addUserSuccess, updateUserSuccess))
      .subscribe(() => this.back());
  }

  /** Initialize Reactive Form */
  private initializeForm() {
    this.createUser = new FormGroup({
      id: new FormControl(0),
      title: new FormControl('', [
        Validators.maxLength(3),
        Validators.pattern('^[a-zA-Z]+$'),
      ]),
      employeeFirstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(45),
        Validators.pattern('^[a-zA-Z\\s]+$'),
      ]),
      employeeLastName: new FormControl('', [
        Validators.maxLength(45),
        Validators.pattern('^[a-zA-Z\\s]+$'),
      ]),
      teamName: new FormControl('', Validators.required),
      skill: new FormControl([], Validators.required),
      address: new FormControl('', [
        Validators.required,
        Validators.maxLength(45),
      ]),
      address2: new FormControl('', Validators.maxLength(45)),
      city: new FormControl({ value: '', disabled: true }, Validators.required),
      state: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      zipCode: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      country: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        uniqueEmail('emergencyContactEmail'),
      ]),
      mobileNumber: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        uniquePhoneNumber('emergencyContactPhone'),
      ]),
      roleName: new FormControl('', Validators.required),
      emergencyContactName: new FormControl('', [
        Validators.required,
        Validators.maxLength(45),
        Validators.pattern('^[a-zA-Z\\s]+$'),
      ]),
      emergencyContactEmail: new FormControl('', [
        Validators.required,
        uniqueEmail('email'),
      ]),
      emergencyContactPhone: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        uniquePhoneNumber('mobileNumber'),
      ]),
      emergencyContactRelationship: new FormControl('', [
        Validators.required,
        Validators.maxLength(45),
        Validators.pattern('^[a-zA-Z\\s]+$'),
      ]),
      status: new FormControl('Active', Validators.required),
      profilePicture: new FormControl(null),
    });

    this.createUser.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.saveButtonDisabled = status !== 'VALID';
      });
  }

  /** Load all necessary dropdown data once */
  private loadInitialData() {
    this.store
      .select(selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.createdBy = data.user.id));

    this.store.dispatch(getDRTeams());
    this.store
      .select(selectAllDRTeams)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.drTeamIds = data.filter((team) => team.status).map((team) => ({ name: team.teamName, id: team.id }) );
      });

    this.store.dispatch(getSkills());
    this.store
      .select(selectAllSkills)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.drSkill = data.filter((skill) => skill.status).map((skill) => ({ name: skill.skillName, id: skill.skillName }) );
      });

    this.store
      .select(getPermissionIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissions) => {
        this.hasPermissionToCreateDRSkill = permissions.includes('54');
        this.hasPermissionToCreateDRTeam = permissions.includes('54');
      });

    this.store.dispatch(getRoles());
    this.store
      .select(selectAllRoles)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.role = data));

    this.store.dispatch(loadCountry());
    this.store
      .select(getCountry)
      .pipe(
        takeUntil(this.destroy$),
        filter((c) => c.length > 0),
        take(1)
      )
      .subscribe((countries) => {
        this.country = countries.map((c) => ({
          name: c.name,
          id: c.name,
          countryCode: c.countryCode,
        }));
      });
  }

  /** Load user for editing */
  private editUserData() {
    this.email = this.route.snapshot.paramMap.get('email') ?? '';
    this.redirecting =
      this.route.snapshot.paramMap.get('redirecting') === 'true';

    if (!this.email) return;

    this.pageTitle = 'Edit User';
    this.store.dispatch(getUserByEmail({ email: this.email }));

    this.store
      .select(selectUserByEmail)
      .pipe(takeUntil(this.destroy$), take(2))
      .subscribe((foundUser) => {
        if (!foundUser) return;

        this.profilePath = foundUser.uploadPhotoPath
          ? `${foundUser.uploadPhotoPath}?${Date.now()}`
          : '';

        this.enableState(0);
        this.createUser.get('country')?.setValue(foundUser.country);
        this.createUser.get('state')?.setValue(foundUser.state);
        this.createUser.get('city')?.setValue(foundUser.city);
        this.createUser.get('mobileNumber')?.enable();
        this.createUser.get('emergencyContactPhone')?.enable();

        this.enableCity(0);
        this.enableZipCode(0);
        this.createUser.get('zipCode')?.setValue(foundUser.zipCode.toString());

        const roleId = this.role.find((r) => r.roleName === foundUser.role)?.id;
        this.createUser.patchValue({
          id: foundUser.id,
          title: foundUser.title,
          employeeFirstName: foundUser.employeeFirstName,
          employeeLastName: foundUser.employeeLastName,
          teamName: foundUser.drTeamId,
          skill: foundUser.drTeamSkill,
          address: foundUser.address,
          email: foundUser.email,
          mobileNumber: foundUser.mobileNumber.slice(-12),
          roleName: roleId ?? '',
          address2: foundUser.address2,
          emergencyContactName: foundUser.emergencyContactName,
          emergencyContactEmail: foundUser.emergencyContactEmail,
          emergencyContactPhone: foundUser.emergencyContactPhone.slice(-12),
          emergencyContactRelationship: foundUser.emergencyContactRelationship,
          status: foundUser.isActive ? 'Active' : 'Inactive',
        });
        this.saveButtonDisabled = true;
      });
  }

  enableState(reset: number) {
    if (reset === 1) {
      this.createUser.get('state')?.setValue('', { emitEvent: false });
      this.createUser.get('city')?.setValue('', { emitEvent: false });
      this.createUser.get('zipCode')?.setValue('', { emitEvent: false });
      this.createUser.get('city')?.disable({ emitEvent: false });
      this.createUser.get('zipCode')?.disable({ emitEvent: false });
    }
    const countryName = this.createUser.get('country')?.value;

    if (!countryName)
      return this.createUser.get('state')?.disable({ emitEvent: false });

    this.createUser.get('state')?.enable({ emitEvent: false });
    this.createUser.get('mobileNumber')?.enable({ emitEvent: false });
    this.createUser.get('emergencyContactPhone')?.enable({ emitEvent: false });
    this.store.dispatch(loadStateByCountry({ countryName }));

    this.store
      .select(getStateByCountry)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const uniqueStates = Array.from(
          data.reduce((map, st) => map.set(st.name, st), new Map()).values()
        );
        this.state = uniqueStates;
        const selectedCountry = this.country.find(
          (c) => c.name === countryName
        );
        this.countryCode = selectedCountry?.countryCode ?? 0;
      });
  }

  enableCity(reset: number) {
    if (reset === 1) {
      this.createUser.get('city')?.setValue('', { emitEvent: false });
      this.createUser.get('zipCode')?.setValue('', { emitEvent: false });
      this.createUser.get('zipCode')?.disable({ emitEvent: false });
    }
    const stateName = this.createUser.get('state')?.value;
    if (!stateName)
      return this.createUser.get('city')?.disable({ emitEvent: false });

    this.createUser.get('city')?.enable();
    this.store.dispatch(loadCityByState({ stateName }));

    this.store
      .select(getCityByState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.city = data;
        const existingCity = this.createUser.get('city')?.value;
        if (existingCity) {
          this.enableZipCode(0);
        }
      });
  }

  enableZipCode(reset: number) {
    if (reset === 1) {
      this.createUser.get('zipCode')?.setValue('', { emitEvent: false });
    }

    const cityName = this.createUser.get('city')?.value;
    if (!cityName) {
      this.createUser.get('city')?.disable({ emitEvent: false });
      return;
    }

    this.createUser.get('zipCode')?.enable({ emitEvent: false });
    this.zipcodes = this.city.find((c) => c.name === cityName)?.zipCode || [];
  }

  /** File handling */
  onProfilePictureChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];
      this.profile = file;
      this.profileValid = true;
      this.profilePath = URL.createObjectURL(file) + `?${Date.now()}`;
      this.createUser.get('profilePicture')?.setValue(file);
    } else {
      this.profile = null;
      this.profileValid = false;
      this.profilePath = '';
      this.createUser.get('profilePicture')?.setValue(null);
    }
    input.value = '';
    this.cd.markForCheck();
  }

  /** Submit logic */
  add(formGroup: FormGroup) {
    if (!formGroup.valid) return;

    const formData: addUserModel = {
      id: formGroup.get('id')?.value,
      title: formGroup.get('title')?.value,
      employeeFirstName: formGroup.get('employeeFirstName')?.value,
      employeeLastName: formGroup.get('employeeLastName')?.value,
      drTeamId: formGroup.get('teamName')?.value,
      drTeamSkill: formGroup.get('skill')?.value,
      email: formGroup.get('email')?.value,
      mobileNumber: `+${this.countryCode}${
        formGroup.get('mobileNumber')?.value
      }`,
      role: formGroup.get('roleName')?.value,
      address: formGroup.get('address')?.value,
      city: formGroup.get('city')?.value,
      state: formGroup.get('state')?.value,
      zipCode: formGroup.get('zipCode')?.value,
      country: formGroup.get('country')?.value,
      address2: formGroup.get('address2')?.value,
      emergencyContactName: formGroup.get('emergencyContactName')?.value,
      emergencyContactEmail: formGroup.get('emergencyContactEmail')?.value,
      emergencyContactPhone: `+${this.countryCode}${
        formGroup.get('emergencyContactPhone')?.value
      }`,
      emergencyContactRelationship: formGroup.get(
        'emergencyContactRelationship'
      )?.value,
      isActive: formGroup.get('status')?.value === 'Active',
      createdBy: this.createdBy,
      uploadPhotoPath: '',
      permissionIds: '',
      lastChangedBy: this.createdBy,
      profilePicture: this.profile ?? undefined,
    };

    this.email
      ? this.store.dispatch(updateUser({ updateUser: formData }))
      : this.store.dispatch(addUser({ addUser: formData }));
  }

  /** Navigation */
  back() {
    if (!this.redirecting)
      this.router.navigate(['../home/userManagement/userCreation']);
    else this.router.navigate(['../home/viewUser/', this.email]);
  }

  drTeamCreation() {
    const dialogRef = this.dialog.open(NewDrteamCreationComponent, {
      data: { modelId: 1 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(getDRTeams());
      }
    });
  }

  drSkillCreation() {
    const dialogRef = this.dialog.open(NewSkillCreationComponent, {
      data: { modelId: 1 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(getSkills());
      }
    });
  }

  getProfilePicture(event: File) {
    this.profile = event;
  }

  getProfileValid(event: boolean) {
    this.profileValid = event;
  }

  formatPhoneNumber(controlName: string) {
    let value = this.createUser.get(controlName)?.value || '';
    value = value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    if (value.length > 3 && value.length <= 6) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1-$2');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,4})/, '$1-$2-$3');
    }
    this.createUser.patchValue({ [controlName]: value }, { emitEvent: false });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
