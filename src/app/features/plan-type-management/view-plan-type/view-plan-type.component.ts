import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { planType } from '../../../core/models/planType.model';

@Component({
  selector: 'app-view-plan-type',
  standalone: true,
  imports: [CommonModule, NavigationbarComponent, MatIcon, MatDialogModule],
  templateUrl: './view-plan-type.component.html',
  styleUrl: './view-plan-type.component.css',
})
export class ViewPlanTypeComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: planType) {}
}
