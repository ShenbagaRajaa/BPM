import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPlanLevelComponent } from './list-plan-level/list-plan-level.component';
import { NewPlanLevelComponent } from './new-plan-level/new-plan-level.component';
import { ViewPlanLevelComponent } from './view-plan-level/view-plan-level.component';

const routes: Routes = [
      { path: '', component:ListPlanLevelComponent  },
      { path: 'newPlanLevelCreation', component: NewPlanLevelComponent  },
      { path: 'viewPlanLevel', component: ViewPlanLevelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanLevelManagementRoutingModule { }
