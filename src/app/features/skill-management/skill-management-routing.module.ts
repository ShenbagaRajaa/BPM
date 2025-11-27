import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOfSkillsComponent } from './list-of-skills/list-of-skills.component';
import { NewSkillCreationComponent } from './new-skill-creation/new-skill-creation.component';
import { ViewSkillsComponent } from './view-skills/view-skills.component';

const routes: Routes = [
    { path: '', component: ListOfSkillsComponent },
    { path: 'newSkillsCreation', component: NewSkillCreationComponent },
    { path: 'viewSkills', component:ViewSkillsComponent },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillManagementRoutingModule { }
