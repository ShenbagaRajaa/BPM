import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOfSystemTypesComponent } from './list-of-system-types/list-of-system-types.component';
import { NewSystemTypeCreationComponent } from './new-system-type-creation/new-system-type-creation.component';

const routes: Routes = [
    {path: '' , component : ListOfSystemTypesComponent},
    {path:'newSystemTypeCreation' , component : NewSystemTypeCreationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemTypeManagementRoutingModule { }
