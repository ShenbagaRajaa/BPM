import { Component, Inject } from '@angular/core';
import { system } from '../../../core/models/system.model';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';

@Component({
  selector: 'app-view-system',
  standalone: true,
  imports: [  
    CommonModule,
    NavigationbarComponent,
    MatIcon,
    MatDialogModule,],
  templateUrl: './view-system.component.html',
  styleUrl: './view-system.component.css'
})
export class ViewSystemComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: system) {}
}
