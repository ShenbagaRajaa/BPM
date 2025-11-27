import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOfSitesComponent } from './list-of-sites/list-of-sites.component';
import { NewSiteCreationComponent } from './new-site-creation/new-site-creation.component';
import { ViewSiteComponent } from './view-site/view-site.component';

const routes: Routes = [
  { path: '', component: ListOfSitesComponent },
  { path: 'listOfSites', component: ListOfSitesComponent },
  { path: 'newSiteCreation', component: NewSiteCreationComponent },
  { path: 'newSiteCreation/:id', component: NewSiteCreationComponent },
  { path: 'viewUser/:id', component: ViewSiteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteManagementRoutingModule { }
