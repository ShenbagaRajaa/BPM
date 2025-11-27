import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Notification } from '../../core/models/notification.model';
import { CommonModule } from '@angular/common';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatSnackBarModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class NotificationComponent {
  constructor(
    private bottomSheetRef: MatSnackBarRef<NotificationComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: Notification,
    private router: Router
  ) {}

  openLink(event: MouseEvent): void {
    // Dismiss the snackbar with action to trigger the notification panel
    this.bottomSheetRef.dismissWithAction();

    // If there's a linkURL, extract the path and navigate
    if (this.data.linkURL) {
      const extractedPath = this.data.linkURL.substring(
        this.data.linkURL.indexOf('/home')
      );
      const parser = document.createElement('a');
      parser.href = extractedPath;

      const pathname = parser.pathname;
      const queryString = parser.search;

      const queryParams = new URLSearchParams(queryString);
      let paramsObj: any = {};
      queryParams.forEach((value, key) => {
        paramsObj[key] = value;
      });
      paramsObj['_'] = new Date().getTime();
      this.router.navigate([pathname], { queryParams: paramsObj });
    }

    event.preventDefault();
  }
}
