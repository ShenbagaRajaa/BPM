import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';

@Component({
  selector: 'app-view-skills',
  standalone: true,
  imports: [NavigationbarComponent, MatIcon, MatDialogModule],
  templateUrl: './view-skills.component.html',
  styleUrl: './view-skills.component.css',
})
export class ViewSkillsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
