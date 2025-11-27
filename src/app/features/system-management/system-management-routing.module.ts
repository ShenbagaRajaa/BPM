import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOfSystemsComponent } from './list-of-systems/list-of-systems.component';
import { NewSystemCreationComponent } from './new-system-creation/new-system-creation.component';
import { ViewSystemComponent } from './view-system/view-system.component';

const routes: Routes = [
  { path: '', component:ListOfSystemsComponent  },
  { path: 'newSystemCreation', component: NewSystemCreationComponent },
  { path: 'viewSystem', component: ViewSystemComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemManagementRoutingModule { }
