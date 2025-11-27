import { Component, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { hideSnackBar } from '../../core/store/snackbar-state/snackbar.action';
import { getSnackbarMessage } from '../../core/store/snackbar-state/snackbar.selector';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SnackbarComponent {
  constructor(private snackBar: MatSnackBar, private store: Store) {}

  ngOnInit(): void {
    // Subscribe to the Snackbar state from NgRx store
    this.store.select(getSnackbarMessage).subscribe((snackbarState) => {
      if (snackbarState.show) {
        // Open Angular Material Snackbar with provided message, action label, and duration
        this.snackBar
          .open(snackbarState.message, snackbarState.actionLabel, {
            duration: snackbarState.duration,
            panelClass: ['snackbar', snackbarState.status],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          })
          .afterDismissed()
          .subscribe(() => {
            // Dispatch action to hide snackbar after it disappears
            this.store.dispatch(hideSnackBar());
          });
      }
    });
  }
}
