import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultConfigurationComponent } from './default-configuration/default-configurations.component';
import { AddConfigurationSettingsComponent } from './add-configuration-settings/add-configuration-settings.component';
import { ViewConfigurationSettingsComponent } from './view-configuration-settings/view-configuration-settings.component';

const routes: Routes = [
  { path: '', component: DefaultConfigurationComponent },
    { path: 'addConfigurationSettings', component: AddConfigurationSettingsComponent },
    { path: 'viewConfigurationSettings', component:  ViewConfigurationSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefaultConfigurationsRoutingModule {}
