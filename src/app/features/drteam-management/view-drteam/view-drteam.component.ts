import { Component, Inject } from '@angular/core';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { drTeam } from '../../../core/models/drTeam.model';

@Component({
  selector: 'app-view-drteam',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    NavigationbarComponent,
    MatIcon,
    MatDialogModule,
  ],
  templateUrl: './view-drteam.component.html',
  styleUrl: './view-drteam.component.css',
})
export class ViewDrteamComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: drTeam) {}
}
