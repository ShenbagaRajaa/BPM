import { Component, Inject } from '@angular/core';
import { planLevel } from '../../../core/models/planLevel.model';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';

@Component({
  selector: 'app-view-plan-level',
  standalone: true,
  imports: [
    CommonModule,
    NavigationbarComponent,
    MatIcon,
    MatDialogModule,
  ],
  templateUrl: './view-plan-level.component.html',
  styleUrl: './view-plan-level.component.css',
})
export class ViewPlanLevelComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: planLevel) {
  }
}
