import { Component, Inject, Optional } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { appState } from '../../../core/store/app-state/app.state';
import { SiteService } from '../../../core/services/site.service';
import { showSnackBar } from '../../../core/store/snackbar-state/snackbar.action';
import {
  loadCityByState,
  loadStateByCountry,
  loadCountry,
} from '../../../core/store/country-state/country.action';
import {
  getCityByState,
  getStateByCountry,
  getCountry,
} from '../../../core/store/country-state/country.selector';
import { selectUser } from '../../../core/store/auth-state/auth.selector';
import {
  editSite,
  getSite,
  getSites,
} from '../../../core/store/site-state/site.action';
import { selectSite } from '../../../core/store/site-state/site.selector';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { city } from '../../../core/models/city.model';
import { country } from '../../../core/models/country.model';
import { site } from '../../../core/models/site.model';
import { state } from '../../../core/models/state.model';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { SearchableDropdownComponent } from '../../../shared/searchable-state-dropdown/searchable-dropdown.component';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-new-site-creation',
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
    MatDialogModule,
    SearchableDropdownComponent,
  ],
  templateUrl: './new-site-creation.component.html',
  styleUrl: './new-site-creation.component.css',
})
export class NewSiteCreationComponent {
  city: city[] = [];
  state: state[] = [];
  country: country[] = [];
  zipCodes: string[] = [];
  status: string[] = ['Active', 'Inactive'];

  createSite!: FormGroup;
  pageTitle = 'Create New Site';
  saveButtonDisabled = true;
  countryCode = 0;
  createdBy = 0;
  siteId = 0;
  classValue = 'md:p-4 pb-16 h-screen flex flex-col bg-mBgBlue md:bg-lblue';
  backButton = true;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<appState>,
    private route: ActivatedRoute,
    private siteService: SiteService,
    private router: Router,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { modelId: number } | null = null,
    @Optional()
    private dialogRef: MatDialogRef<NewSiteCreationComponent> | null = null
  ) {
    if (data?.modelId === 1) {
      this.classValue = 'md:p-4 pb-16 flex flex-col bg-mBgBlue md:bg-lblue';
      this.backButton = false;
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => (this.siteId = params['siteId'])
    );
    this.initializeForm();
    this.loadData();
  }

  private initializeForm() {
    this.createSite = new FormGroup({
      id: new FormControl(0),
      siteName: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      siteCode: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9_\\s]+$'),
      ]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      state: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      zipCode: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      country: new FormControl('', [Validators.required]),
      status: new FormControl('Active', [Validators.required]),
      description: new FormControl('', [Validators.maxLength(500)]),
    });

    this.createSite.statusChanges.subscribe((status) => {
      this.saveButtonDisabled = status !== 'VALID';
    });
  }

  enableState(reset: number) {
    if (reset === 1) {
      this.createSite.get('state')?.setValue('', { emitEvent: false });
      this.createSite.get('city')?.setValue('', { emitEvent: false });
      this.createSite.get('zipCode')?.setValue('', { emitEvent: false });
      this.createSite.get('city')?.disable({ emitEvent: false });
      this.createSite.get('zipCode')?.disable({ emitEvent: false });
    }
    const countryName = this.createSite.get('country')?.value;

    if (!countryName)
      return this.createSite.get('state')?.disable({ emitEvent: false });

    this.createSite.get('state')?.enable({ emitEvent: false });
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
        const existingState = this.createSite.get('state')?.value;
        if (existingState) {
          this.enableCity(0);
        }
      });
  }

  enableCity(reset: number) {
    if (reset === 1) {
      this.createSite.get('city')?.setValue('', { emitEvent: false });
      this.createSite.get('zipCode')?.setValue('', { emitEvent: false });
      this.createSite.get('zipCode')?.disable({ emitEvent: false });
    }
    const stateName = this.createSite.get('state')?.value;

    if (!stateName)
      return this.createSite.get('city')?.disable({ emitEvent: false });

    this.createSite.get('city')?.enable({ emitEvent: false });
    this.store.dispatch(loadCityByState({ stateName }));

    this.store
      .select(getCityByState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.city = data;
        const existingCity = this.createSite.get('city')?.value;
        if (existingCity) {
          this.enableZipCode(0);
        }
      });
  }

  enableZipCode(reset: number) {
    if (reset === 1)
      this.createSite.get('zipCode')?.setValue('', { emitEvent: false });
    const cityName = this.createSite.get('city')?.value;
    if (!cityName)
      return this.createSite.get('city')?.disable({ emitEvent: false });

    if (cityName) {
      this.createSite.get('zipCode')?.enable({ emitEvent: false });
      this.zipCodes = this.city.find((c) => c.name === cityName)?.zipCode || [];
    }
  }

  add(formGroup: FormGroup) {
    if (!formGroup.valid) return;

    this.store
      .select(selectUser)
      .subscribe((data) => (this.createdBy = data.user.id));

    const baseSiteData: site = {
      ...formGroup.value,
      status: formGroup.get('status')?.value === 'Active',
      createdBy: this.createdBy,
      lastChangedBy: this.createdBy,
      createdDate: new Date(),
      lastChangedDate: new Date(),
      history: {
        createdBy: this.createdBy,
        createdDate: new Date(),
        lastChangedBy: this.createdBy,
        lastChangedDate: new Date(),
      },
    };

    if (this.siteId) {
      this.store.dispatch(
        editSite({ editSite: { ...baseSiteData, id: this.siteId } })
      );
    } else {
      this.siteService.addSite(baseSiteData).subscribe({
        next: () => {
          this.store.dispatch(
            showSnackBar({
              message: 'Site added successfully',
              status: 'success',
            })
          );

          if (this.data?.modelId === 1 && this.dialogRef) {
            this.store.dispatch(getSites());
            this.dialogRef.close(true);
          } else {
            this.router.navigate(['../home/siteManagement/listOfSites']);
          }
        },
        error: (err) =>
          this.store.dispatch(showSnackBar({ message: err.error.detail })),
      });
    }
  }

  back() {
    if (this.data?.modelId === 1 && this.dialogRef) this.dialogRef.close();
    else this.router.navigate(['../home/siteManagement/']);
  }

  private loadData() {
    this.store
      .select(selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.createdBy = data.user.id));
    this.store.dispatch(loadCountry());

    this.store
      .select(getCountry)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.country = data.map((c) => ({
          name: c.name,
          id: c.name,
          countryCode: c.countryCode,
        }));
      });

    if (this.siteId) {
      this.pageTitle = 'Edit Site';
      this.store.dispatch(getSite({ siteId: this.siteId }));

      this.store
        .select(selectSite)
        .pipe(takeUntil(this.destroy$), take(2))
        .subscribe((foundSite) => {
          if (foundSite) {
            this.createSite.get('country')?.setValue(foundSite.country);
            this.createSite.get('state')?.setValue(foundSite.state);
            this.createSite.get('city')?.enable({ emitEvent: false });
            this.createSite.get('city')?.setValue(foundSite.city);
            this.createSite
              .get('zipCode')
              ?.setValue(foundSite.zipCode.toString());
            this.enableState(0);

            setTimeout(() => {
              this.createSite.patchValue({
                id: foundSite.id,
                siteName: foundSite.siteName,
                siteCode: foundSite.siteCode,
                address: foundSite.address,
                status: foundSite.status ? 'Active' : 'Inactive',
                description: foundSite.description,
              });
            }, 100);
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
