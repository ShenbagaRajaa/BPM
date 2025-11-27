import { Component } from '@angular/core';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
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
import { getRole } from '../../../core/store/role-state/role.action';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { role } from '../../../core/models/role.model';
import { addRole, editRole } from '../../../core/store/role-state/role.action';
import { selectRole } from '../../../core/store/role-state/role.selector';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import {
  getPermissions,
  getPermissionsByRoleId,
} from '../../../core/store/permission-state/permission.action';
import { selectAllPermissions } from '../../../core/store/permission-state/permission.selector';
import { permission } from '../../../core/models/permissions.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { showSnackBar } from '../../../core/store/snackbar-state/snackbar.action';
import { AssignPermissionToRoleComponent } from '../../user-management/assign-permission-to-role/assign-permission-to-role.component';

@Component({
  selector: 'app-new-role-creation',
  standalone: true,
  imports: [
    NavigationbarComponent,
    ReactiveFormsModule,
    FormsModule,
    InputFieldComponent,
    MatSelectModule,
    DropdownComponent,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatButtonModule,
    TextFieldModule,
    MatCheckboxModule,
    AssignPermissionToRoleComponent,
  ],
  templateUrl: './new-role-creation.component.html',
  styleUrl: './new-role-creation.component.css',
})
export class NewRoleCreationComponent {
  status: string[] = ['Active', 'Inactive'];
  saveButtonDisabled = true;
  pageTitle = 'Create New Role';
  createRole!: FormGroup;
  stateValue: string = '';
  countryCode: number = 0;
  createdBy: number = 0;
  roleId: number = 0;
  permissions!: permission[];
  permissionsData!: permission[];
  selectedPermissions: boolean[] = [];

  constructor(
    private store: Store<appState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Fetch roleId from query params if editing an existing role
    this.route.queryParams.subscribe((params) => {
      this.roleId = params['roleId'];
    });

    this.initializeForm();
    this.getData();
  }
  // Initializes the form with default values and validators
  private initializeForm() {
    this.createRole = new FormGroup({
      id: new FormControl(0),
      roleName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      status: new FormControl('Active', [Validators.required]),
    });
  }
  // Handles saving assigned permissions
  savePermissions(data: any) {
    this.saveButtonDisabled = false;
    this.selectedPermissions = data;
  }
  // Handles adding a new role or updating an existing role
  add(formGroup: FormGroup) {
    let createdBy = 0;
    if (formGroup.valid) {
      this.store.select(selectUser).subscribe((data) => {
        createdBy = data.user.id;
      });

      const selectedPermissions: string | number[] = this.permissions
        .filter((_, i) => this.selectedPermissions[i])
        .map((perm) => perm.id);

      const addRoleData: role = {
        roleName: formGroup.get('roleName')?.value,
        status: formGroup.get('status')?.value === 'Active' ? true : false,
        createdBy: createdBy,
        lastChangedBy: 0,
        id: 0,
      };

      let updateRoleData: role = {
        id: formGroup.get('id')?.value,
        roleName: formGroup.get('roleName')?.value,
        status: formGroup.get('status')?.value === 'Active' ? true : false,
        lastChangedBy: createdBy,
        createdBy: createdBy,
      };

      if (selectedPermissions.length === 0) {
        this.store.dispatch(
          showSnackBar({
            message: 'Please select atleast one permission',
            status: 'error',
          })
        );
      } else {
        if (this.roleId) {
          this.store.dispatch(
            editRole({
              editRole: updateRoleData,
              selectedPermissions: selectedPermissions,
            })
          );
        } else {
          this.store.dispatch(
            addRole({
              addRole: addRoleData,
              selectedPermissions: selectedPermissions,
            })
          );
        }
      }
    }
  }
  // Navigates back to role management screen
  back() {
    this.router.navigate([`../home/roleManagement/`]);
  }
  // Handles state dropdown selection changes
  onStateChange(selectedStateId: string) {
    this.createRole.patchValue({ state: selectedStateId });
  }
  // Triggered when component properties change
  ngOnChanges() {
    this.getData();
  }
  // Fetches user and permissions data
  getData() {
    this.store.select(selectUser).subscribe((data) => {
      this.createdBy = data.user.id;
    });
    this.store.dispatch(getPermissions());

    this.store.select(selectAllPermissions).subscribe((permissionData) => {
      this.permissions = permissionData;
      this.selectedPermissions = new Array(permissionData.length).fill(false);
    });

    if (this.roleId) {
      this.pageTitle = 'Edit Role';
      this.store.dispatch(getRole({ roleId: this.roleId }));
      this.store.dispatch(getPermissionsByRoleId({ roleId: this.roleId }));

      this.store.select(selectRole).subscribe((foundRole) => {
        if (foundRole) {
          setTimeout(() => {
            this.createRole.patchValue({
              id: foundRole.id,
              roleName: foundRole.roleName,
              status: foundRole.status ? 'Active' : 'Inactive',
            });
            this.saveButtonDisabled = true;
          }, 100);
        }
      });
    }

    // Watch form status
    this.createRole.statusChanges.subscribe((status) => {
      this.saveButtonDisabled = status !== 'VALID';
    });
  }
}
