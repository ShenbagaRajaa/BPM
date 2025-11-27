import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { environment } from '../../../environment/environment';
import { MatIcon } from '@angular/material/icon';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { NavigationbarComponent } from '../navigationbar/navigationbar.component';
import { A11yModule } from '@angular/cdk/a11y';
import { Store } from '@ngrx/store';
import { showSnackBar } from '../../core/store/snackbar-state/snackbar.action';

@Component({
  selector: 'app-resolve-problem-dialog',
  standalone: true,
  templateUrl: './resolve-problem-dialog.component.html',
  styleUrls: ['./resolve-problem-dialog.component.css'],
  imports: [
    MatFormFieldModule,
    MatLabel,
    ReactiveFormsModule,
    NgIf,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIcon,
    FileUploadComponent,
    NavigationbarComponent,
    A11yModule,
  ],
})
export class ResolveProblemDialogComponent {
  pageTitle: string = 'Resolve Problem';
  resolveProblemForm!: FormGroup;
  submitButtonDisabled: boolean = true;
  button: string = 'RESOLVE';
  uploadedFile: File | null = null;
  reportingFilePath: string | null = null;
  apiUrl = environment.apiUrl + '/';
  existingFileName: string = '';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: number;
      taskId: number;
      reportingMessage: string;
      reportingFilePath: string;
    },
    private dialogRef: MatDialogRef<ResolveProblemDialogComponent>,
    private store: Store
  ) {
    this.reportingFilePath = data.reportingFilePath;
    if(this.reportingFilePath){
    const file = data.reportingFilePath;
    const cleanedPath = file.replace(/['"]/g, '');
    this.existingFileName = cleanedPath.split('\\').pop() || '';
    }
  }

  ngOnInit() {
    // Initialize form with one required field for the solution content
    this.resolveProblemForm = this.fb.group({
      solutionContent: ['', [Validators.required]],
    });

    this.resolveProblemForm.statusChanges.subscribe((status) => {
      this.submitButtonDisabled = status !== 'VALID';
    });
  }
  // Handle file selection for file upload
  onFileChange(event: File | null) {
    const maxSize = 5 * 1024 * 1024;

    if (!event) {
      this.clearFile();
      return;
    }

    if (event.size > maxSize) {
      this.store.dispatch(
        showSnackBar({ message: 'File size exceeds 5 MB.', status: 'error' })
      );
      return;
    }

    this.uploadedFile = event;
  }
  // Handle form submission when the user clicks the "Resolve" button
  onSubmit(): void {
    this.dialogRef.close({
      id: this.data.id,
      confirmed: true,
      solution: this.resolveProblemForm.get('solutionContent')?.value,
      taskId: this.data.taskId,
      file: this.uploadedFile,
    });
  }
  // Handle cancellation of the dialog
  cancel() {
    this.dialogRef.close(false);
  }
  // Generate the file URL for downloading the reported file
  getFileUrl(): string | null {
    if (!this.reportingFilePath) {
      return null;
    }
    const sanitizedPath = this.reportingFilePath.replace(/\\/g, '/');
    return `${environment.apiUrl}/${sanitizedPath}`;
  }

  // Clear the uploaded file
  clearFile(): void {
    this.uploadedFile = null;
  }
}
