import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { department } from '../../../core/models/department.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-view-department',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    NavigationbarComponent,
    MatIcon,
    MatDialogModule,
  ],
  templateUrl: './view-department.component.html',
  styleUrl: './view-department.component.css',
})
export class ViewDepartmentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: department) {}
}
