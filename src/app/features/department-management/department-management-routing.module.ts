import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOfDepartmentsComponent } from './list-of-departments/list-of-departments.component';
import { NewDepartmentCreationComponent } from './new-department-creation/new-department-creation.component';
import { ViewDepartmentComponent } from './view-department/view-department.component';

const routes: Routes = [
  { path: '', component: ListOfDepartmentsComponent },
  { path: 'newDepartmentCreation', component: NewDepartmentCreationComponent },
  { path: 'viewDepartment', component: ViewDepartmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentManagementRoutingModule {}
