import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOfDrteamsComponent } from './list-of-drteams/list-of-drteams.component';
import { NewDrteamCreationComponent } from './new-drteam-creation/new-drteam-creation.component';

const routes: Routes = [
  { path: '', component: ListOfDrteamsComponent },
  { path: 'newDRTeamCreation', component: NewDrteamCreationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrteamManagementRoutingModule {}
