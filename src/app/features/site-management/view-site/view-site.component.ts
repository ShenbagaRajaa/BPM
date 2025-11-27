import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { site } from '../../../core/models/site.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-site',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    NavigationbarComponent,
  ],
  templateUrl: './view-site.component.html',
  styleUrl: './view-site.component.css',
})
export class ViewSiteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: site) {}
}
