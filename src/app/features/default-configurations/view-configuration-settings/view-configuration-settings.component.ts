import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';

@Component({
  selector: 'app-view-configuration-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    NavigationbarComponent,
  ],
  templateUrl: './view-configuration-settings.component.html',
  styleUrls: ['./view-configuration-settings.component.css'],
})
export class ViewConfigurationSettingsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
