import { Location, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-navigationbar',
  standalone: true,
  imports: [MatIconModule, NgIf, MatButtonModule, MatRippleModule],
  templateUrl: './navigationbar.component.html',
  styleUrl: './navigationbar.component.css',
})
export class NavigationbarComponent {
  @Input() pageTitle = 'Plans';
  @Input() buttonLabel = '';
  @Input() arrow = true;
  @Input() button = false;
  @Output() activeValue = new EventEmitter<any>();
  // Injecting Angular's Location service to enable navigation functionality
  constructor(private location: Location) {}
  // Method to navigate back to the previous page
  navigate() {
    this.location.back();
  }
  // Method to emit an event when the action button is clicked
  onClick() {
    this.activeValue.emit();
  }
}
