import { Component, Inject } from '@angular/core';
import { systemType } from '../../../core/models/systemType.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';

@Component({
  selector: 'app-view-system-type',
  standalone: true,
  imports: [MatButtonModule,
        CommonModule,
        NavigationbarComponent,
        MatIcon,
        MatDialogModule,],
  templateUrl: './view-system-type.component.html',
  styleUrl: './view-system-type.component.css'
})
export class ViewSystemTypeComponent {
constructor(@Inject(MAT_DIALOG_DATA) public data: systemType) {}
}
