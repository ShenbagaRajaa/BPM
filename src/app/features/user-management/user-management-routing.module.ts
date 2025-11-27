import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';
import { PermissionManagementComponent } from './permission-management/permission-management.component';
import { AssignPermissionToRoleComponent } from './assign-permission-to-role/assign-permission-to-role.component';
import { UserCreationComponent } from './user-creation/user-creation.component';
import { CreateNewUserComponent } from './create-new-user/create-new-user.component';
import { ViewUserComponent } from './view-user/view-user.component';

const routes: Routes = [
  { path: '', component: UserManagementComponent },
  { path: 'permissionManagement', component: PermissionManagementComponent },

  {
    path: 'assignPermissionToRole',
    component: AssignPermissionToRoleComponent,
  },
  { path: 'userCreation', component: UserCreationComponent },
  { path: 'createNewUser', component: CreateNewUserComponent },
  { path: 'createNewUser/:email/:redirecting', component: CreateNewUserComponent },
  {
    path: 'roleManagement',
    loadChildren: () =>
      import('../role-management/role-management.module').then(
        (m) => m.RoleManagementModule
      ),
    data: { roles: ['Administrator'] },
  },
  { path: 'viewUser/:email', component: ViewUserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
