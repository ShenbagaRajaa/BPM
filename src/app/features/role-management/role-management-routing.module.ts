import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOfRolesComponent } from './list-of-roles/list-of-roles.component';
import { NewRoleCreationComponent } from './new-role-creation/new-role-creation.component';

const routes: Routes = [
  {path: '' , component : ListOfRolesComponent},
  {path:'newRoleCreation' , component : NewRoleCreationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleManagementRoutingModule { }
