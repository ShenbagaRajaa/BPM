import { Component } from '@angular/core';
import { appState } from '../../../core/store/app-state/app.state';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  addConfiguration,
  getConfiguration,
  getConfigurations,
  updateConfiguration,
} from '../../../core/store/configuration-settings-state/configuration-settings.action';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  selectAllConfigurations,
  selectConfiguration,
} from '../../../core/store/configuration-settings-state/configuration-settings.selector';
import { ConfigurationSetting } from '../../../core/models/defaultConfig.model';
import { selectUser } from '../../../core/store/auth-state/auth.selector';

@Component({
  selector: 'app-add-configuration-settings',
  standalone: true,
  imports: [
    NavigationbarComponent,
    InputFieldComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-configuration-settings.component.html',
  styleUrls: ['./add-configuration-settings.component.css'],
})
export class AddConfigurationSettingsComponent {
  defaultConfigurations: ConfigurationSetting[] = [];

  createConfiguration!: FormGroup;
  pageTitle = 'Add Default Setting';
  configId: number = 0;
  saveButtonDisabled: boolean = true;
  lastChangedBy: number = 0;
  createdBy: number = 0;

  constructor(
    private store: Store<appState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Dispatch action to get all configurations
    this.store.dispatch(getConfigurations());
    this.store.select(selectAllConfigurations).subscribe({
      next: (data) => {
        this.defaultConfigurations = data;
      },
    });
    this.initializeForm();

    this.route.queryParams.subscribe((params) => {
      this.configId = params['id'] ? +params['id'] : 0;

      if (this.configId) {
        this.pageTitle = 'Update Default Setting';
        this.loadConfigurationForEdit();
      }
    });
  }
  // Initialize form controls with validators
  private initializeForm(): void {
    this.createConfiguration = new FormGroup({
      settingName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      settingValue: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
      description: new FormControl('', [Validators.maxLength(200)]),
    });

    this.watchFormStatus();
  }
  // Load configuration data for editing (when configId is available)
  private loadConfigurationForEdit(): void {
    this.store.dispatch(getConfiguration({ id: this.configId }));

    this.store.select(selectConfiguration).subscribe((configurationData) => {
      if (configurationData) {
        setTimeout(() => {
          this.createConfiguration.patchValue({
            id: configurationData.id,
            settingName: configurationData.name,
            settingValue: configurationData.value,
            description: configurationData.description || '',
          });
          this.saveButtonDisabled = true;
        }, 100);
      }
    });
  }
  // Watch form status to enable or disable the save button
  private watchFormStatus(): void {
    if (this.createConfiguration) {
      this.createConfiguration.statusChanges.subscribe((status) => {
        this.saveButtonDisabled = status !== 'VALID';
      });
    }
  }
  // Method to add or update the configuration based on whether configId exists
  add(): void {
    if (this.createConfiguration.valid) {
      this.store.select(selectUser).subscribe((data) => {
        this.lastChangedBy = data.user.id;
        this.createdBy = data.user.id;
      });

      const configurationData = {
        id: this.configId,
        name: this.createConfiguration.get('settingName')?.value,
        value: this.createConfiguration.get('settingValue')?.value,
        description: this.createConfiguration.get('description')?.value || '',
        createdBy: this.createdBy,
        createdDate: new Date(),
        lastChangedBy: this.lastChangedBy,
        lastChangedDate: new Date(),
      };

      if (this.configId) {
        this.store.dispatch(
          updateConfiguration({
            updatedConfig: configurationData,
          })
        );
      } else {
        this.store.dispatch(addConfiguration({ newConfig: configurationData }));
      }
    }
  }

  back(): void {
    this.router.navigate(['home/defaultConfigurations/']);
  }
}
