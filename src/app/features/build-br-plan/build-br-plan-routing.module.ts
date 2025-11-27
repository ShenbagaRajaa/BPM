import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuildBrPlanComponent } from './build-br-plan/build-br-plan.component';
import { TaskCreationComponent } from './task-creation/task-creation.component';

const routes: Routes = [
  { path: '', component: BuildBrPlanComponent },
  { path: 'add-plan', component: BuildBrPlanComponent },
  { path: 'add-plan/:id', component: BuildBrPlanComponent },
  { path: 'edit-task', component: TaskCreationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuildBRPlanRoutingModule {}
