import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPlanTypeComponent } from './list-plan-type/list-plan-type.component';
import { NewPlanTypeCreationComponent } from './new-plan-type-creation/new-plan-type-creation.component';
import { ViewPlanTypeComponent } from './view-plan-type/view-plan-type.component';

const routes: Routes = [
    { path: '', component:ListPlanTypeComponent  },
    { path: 'newPlanTypeCreation', component: NewPlanTypeCreationComponent  },
    { path: 'viewPlanType', component: ViewPlanTypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanTypeManagementRoutingModule { }
