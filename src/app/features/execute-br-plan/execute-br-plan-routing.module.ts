import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecuteBRPlanComponent } from './execute-br-plan/execute-br-plan.component';
import { TaskActionComponent } from '../../shared/task-action/task-action.component';

const routes: Routes = [
  { path: '', component: ExecuteBRPlanComponent },
  { path: 'taskAction', component: TaskActionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecuteBRPlanRoutingModule {}
