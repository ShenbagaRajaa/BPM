import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DefaultConfigurationsRoutingModule } from './default-configurations-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, DefaultConfigurationsRoutingModule, FormsModule],
  providers: [DatePipe],
})
export class DefaultConfigurationsModule {}
