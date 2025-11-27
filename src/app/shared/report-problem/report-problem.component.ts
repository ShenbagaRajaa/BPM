import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { SequenceCreationComponent } from '../../features/build-br-plan/sequence-creation/sequence-creation.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { NavigationbarComponent } from '../navigationbar/navigationbar.component';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { selectUser } from '../../core/store/auth-state/auth.selector';
import { taskProblemReporting } from '../../core/store/task-state/task.action';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { showSnackBar } from '../../core/store/snackbar-state/snackbar.action';

@Component({
  selector: 'app-report-problem',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatLabel,
    NavigationbarComponent,
    ReactiveFormsModule,
    NgIf,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    FileUploadComponent,
  ],
  templateUrl: './report-problem.component.html',
  styleUrl: './report-problem.component.css',
})
export class ReportProblemComponent {
  pageTitle: string = 'Report Problem';
  reportProblemForm!: FormGroup;
  saveButtonDisabled: boolean = true;
  button: string = 'REPORT PROBLEM';
  uploadedFile: File | null = null;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: { planId: number; sequenceId: number; taskId: number },
    private dialogRef: MatDialogRef<SequenceCreationComponent>
  ) {}

  ngOnInit() {
    // Initializes the form with 'problemContent' control and its validators
    this.reportProblemForm = this.fb.group({
      problemContent: ['', [Validators.required]],
      fileUpload: [null],
    });

    this.getData();
  }

  ngOnChanges() {
    // Calls getData on changes to ensure the form validation state is updated
    this.getData();
  }

  getData() {
    // Subscribes to form validation status and enables/disables the 'save' button
    this.reportProblemForm.statusChanges.subscribe((status) => {
      this.saveButtonDisabled = status !== 'VALID';
    });
  }

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

  reportProblem() {
    // Retrieves the user data from the store to set the 'createdBy' field

    let createdBy = 0;
    this.store.select(selectUser).subscribe((data) => {
      createdBy = data.user.id;
    });

    const problemContent = this.reportProblemForm.get('problemContent')?.value;
    // Dispatches the taskProblemReporting action to store
    this.store.dispatch(
      taskProblemReporting({
        taskId: this.data.taskId,
        lastChangedBy: createdBy,
        message: problemContent,
        file: this.uploadedFile || undefined,
      })
    );

    this.dialogRef.close(true);
  }
  //Closes the dialog and sends a cancel response
  cancel() {
    this.dialogRef.close(false);
  }

  clearFile(): void {
    this.uploadedFile = null;
  }
}
