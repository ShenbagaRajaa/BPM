import { Component, Inject } from '@angular/core';
import { role } from '../../../core/models/role.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';

@Component({
  selector: 'app-view-role',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    NavigationbarComponent,
    MatIcon,
    MatDialogModule,
  ],
  templateUrl: './view-role.component.html',
  styleUrl: './view-role.component.css',
})
export class ViewRoleComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: role) {}
}
