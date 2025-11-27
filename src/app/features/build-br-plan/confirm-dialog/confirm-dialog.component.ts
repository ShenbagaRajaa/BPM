import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    NavigationbarComponent,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string } // Inject dialog data (title & message)
  ) {}
  // Close dialog with false when cancel is clicked
  onCancel(): void {
    this.dialogRef.close(false);
  }
  // Close dialog with true when confirm is clicked
  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
