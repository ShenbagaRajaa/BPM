import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestBRPlanComponent } from './test-br-plan/test-br-plan.component';
import { TaskActionComponent } from '../../shared/task-action/task-action.component';

const routes: Routes = [
  { path: '', component: TestBRPlanComponent },
  { path: 'taskAction', component: TaskActionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestBRPlanRoutingModule {}
