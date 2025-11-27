import {
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { PlanDetailsService } from '../../../core/services/plan-details.service';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';

@Component({
  selector: 'app-import-dialog',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    NavigationbarComponent,
  ],
  templateUrl: './import-dialog.component.html',
  styleUrl: './import-dialog.component.css',
})
export class ImportDialogComponent {
  form: FormGroup;
  isDragOver = false;
  saveButtonDisabled = true;
  errors: string[] = [
    'File type is not supported. Only .xlsx and .xls are allowed.',
    'File size exceeds the maximum limit of 5MB.',
    'Plan with this ID does not exist.',
    'Duplicate entries found in the uploaded Excel file.',
    'Required column "Task Name" is missing.',
    'File type is not supported. Only .xlsx and .xls are allowed.',
    'File size exceeds the maximum limit of 5MB.',
    'Plan with this ID does not exist.',
    'Duplicate entries found in the uploaded Excel file.',
    'Required column "Task Name" is missing.',
    'File type is not supported. Only .xlsx and .xls are allowed.',
    'File size exceeds the maximum limit of 5MB.',
    'Plan with this ID does not exist.',
    'Duplicate entries found in the uploaded Excel file.',
    'Required column "Task Name" is missing.',
  ];
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    private fb: FormBuilder,
    private planService: PlanDetailsService,
    @Inject(MAT_DIALOG_DATA) public data: { planId: number }
  ) {
    this.form = this.fb.group({
      file: [null, Validators.required], // Reactive form control
    });
  }

  get fileControl() {
    return this.form.get('file')!;
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!this.isValidExcelFile(file)) {
        this.errors = ['Only Excel files (.xlsx, .xls) are allowed.'];
        this.fileControl.setValue(null);
        this.saveButtonDisabled = true;
        return;
      }
      this.errors = [];
      this.fileControl.setValue(file);
      this.saveButtonDisabled = false;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      if (!this.isValidExcelFile(file)) {
        this.errors = ['Only Excel files (.xlsx, .xls) are allowed.'];
        this.fileControl.setValue(null);
        this.saveButtonDisabled = true;
        return;
      }
      this.errors = [];
      this.fileControl.setValue(file);
      this.saveButtonDisabled = false;
    }
  }

  private isValidExcelFile(file: File): boolean {
    const allowedExtensions = ['.xlsx', '.xls', '.xlsm'];
    const fileExtension = file.name
      .slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 1)
      .toLowerCase();
    return allowedExtensions.includes(fileExtension);
  }

  submit(): void {
    this.errors = [];

    if (!this.form.valid) return;

    const file = this.fileControl.value as File;

    // Call your service to upload
    this.planService.importPlanExcel(this.data.planId, file).subscribe({
      next: () => {
        // Success → close dialog
        this.dialogRef.close(true);
      },
      error: (err) => {
        // Error → list in UI
        if (err.error?.errors && Array.isArray(err.error.errors)) {
          this.errors = err.error.errors; // backend sends array of messages
        } else if (err.message) {
          this.errors = [err.message];
        } else {
          this.errors = ['An unknown error occurred.'];
        }
      },
    });
  }
}
