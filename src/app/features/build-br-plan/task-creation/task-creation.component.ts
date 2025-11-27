import { Component, Inject, Input } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { taskAdd } from '../../../core/models/taskAdd.model';
import { appState } from '../../../core/store/app-state/app.state';
import { selectUser } from '../../../core/store/auth-state/auth.selector';
import { getSequence } from '../../../core/store/sequence-state/sequence.action';
import {
  getTask,
  addTask,
  editTask,
  addTaskSuccess,
} from '../../../core/store/task-state/task.action';
import { selectTask } from '../../../core/store/task-state/task.selector';
import { selectUserByRoleId } from '../../../core/store/user-state/user.selector';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { MatIconModule } from '@angular/material/icon';
import { selectSequence } from '../../../core/store/sequence-state/sequence.selector';
import { Task } from '../../../core/models/task.model';
import { getUserByRoleId } from '../../../core/store/user-state/user.action';
import { SearchableDropdownComponent } from '../../../shared/searchable-state-dropdown/searchable-dropdown.component';
import { FileUploadComponent } from '../../../shared/file-upload/file-upload.component';
import { showSnackBar } from '../../../core/store/snackbar-state/snackbar.action';

@Component({
  selector: 'app-task-creation',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputFieldComponent,
    SearchableDropdownComponent,
    NavigationbarComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FileUploadComponent,
  ],
  templateUrl: './task-creation.component.html',
  styleUrl: './task-creation.component.css',
})
export class TaskCreationComponent {
  filterByPlanStatus: string[] = [
    'All',
    'PlanBuildInProcess',
    'PlanReadyToBeTest',
    'PlanExecutionInProcess',
  ];
  pageTitle: string = 'Create Task';
  primaryTeamMembers: { id: number; name: string }[] = [];
  backupTeamMembers: { id: number; name: string }[] = [];
  saveButtonDisabled = true;
  @Input() sequenceId: number = 0;
  userId = 0;
  buildBRPlan!: FormGroup;
  taskId: number = 0;
  tasks: Task[] = [];
  sequenceNumber: string = '';
  uploadedFile: File | null = null;
  existingFileName: string = '';
  isAttachmentRemoved: boolean = false;

  constructor(
    private store: Store<appState>,
    private actions$: Actions,
    public dialogRef: MatDialogRef<TaskCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sequenceId: number; taskId: number }
  ) {
    this.taskId = data.taskId;
    this.sequenceId = data.sequenceId;
  }

  ngOnInit() {
    this.store.select(selectUser).subscribe((data) => {
      this.userId = data.user.id;
    });
    // Fetch all users by role and map them to primary and backup team members
    this.store.dispatch(getUserByRoleId({ roleId: 6 }));
    this.store.select(selectUserByRoleId).subscribe((data) => {
      this.primaryTeamMembers = data.map((member) => ({
        id: member.id,
        name: `${member.employeeFirstName} ${member.employeeLastName}`, // Concatenate firstName and lastName
      }));
      this.backupTeamMembers = data.map((member) => ({
        id: member.id,
        name: `${member.employeeFirstName} ${member.employeeLastName}`, // Concatenate firstName and lastName
      }));
    });

    this.store.dispatch(getSequence({ sequenceId: this.sequenceId }));
    this.store.select(selectSequence).subscribe((seq) => {
      this.sequenceNumber = ` [${seq.sequenceNumber}]`;
    });

    this.buildBRPlan = new FormGroup({
      primaryTeamMember: new FormControl('', [Validators.required]),
      backupTeamMember: new FormControl('', [Validators.required]),
      taskTitle: new FormControl('', [
        Validators.required,
        Validators.maxLength(60),
      ]),
      taskEstimates: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?:[0-2][0-9]):(?:[0-5][0-9])$/),
      ]),
      taskDescription: new FormControl('', [
        Validators.required,
        Validators.maxLength(500),
      ]),
    });

    this.buildBRPlan.statusChanges.subscribe((status) => {
      this.saveButtonDisabled = status !== 'VALID';
    });

    this.getBackupTeamMember();
    // If editing an existing task, load its data into the form
    if (this.taskId) {
      this.pageTitle = 'Edit Task';
      this.store.dispatch(getTask({ taskId: this.taskId }));
      this.store.select(selectTask).subscribe((data) => {
        this.buildBRPlan.patchValue({
          primaryTeamMember: data.primaryTeamMember,
          backupTeamMember: data.backupTeamMember,
          taskTitle: data.taskTitle,
          taskEstimates: this.transform(data.taskEstimates),
          taskDescription: data.taskDescription,
        });
        this.existingFileName = data.fileName || '';
      });
    }
    this.actions$.pipe(ofType(addTaskSuccess, editTask)).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  // Method to handle task creation or update
  addNewTask(formGroup: FormGroup) {
    if (formGroup.valid) {
      let taskEstimates = this.buildBRPlan.get('taskEstimates')?.value;
      taskEstimates = taskEstimates.replace(':', '');
      const addTaskData: taskAdd = {
        ...this.buildBRPlan.value,
        taskEstimates: taskEstimates,
        createdBy: this.userId,
        sequenceId: this.sequenceId,
        id: this.taskId,
        lastChangedBy: this.userId,
      };
      addTaskData.file = this.uploadedFile ? this.uploadedFile : null;

      if (this.isAttachmentRemoved) {
        addTaskData.isAttachmentRemoved = true;
        addTaskData.filePath = this.existingFileName;
      }
      if (this.taskId) {
        this.store.dispatch(editTask({ editTask: addTaskData }));
      } else {
        this.store.dispatch(addTask({ addTask: addTaskData }));
      }
    }
  }

  cancel() {
    this.dialogRef.close(true);
  }

  // Helper function to transform a numeric time value into HH:MM format
  transform(value: string | number): string {
    if (!value) return '';
    const time = value.toString().padStart(4, '0');
    return `${time.slice(0, 2)}:${time.slice(2)}`;
  }

  // Method to filter out selected primary team member from backup options
  getBackupTeamMember() {
    this.buildBRPlan.get('backupTeamMember')?.setValue('');
    this.buildBRPlan
      .get('primaryTeamMember')
      ?.valueChanges.subscribe((selectedMember) => {
        // Filter backup team members to exclude the selected primary team member
        this.backupTeamMembers = this.primaryTeamMembers.filter(
          (member) => member.id !== selectedMember
        );

        // If the selected backup team member is the same as the primary, reset it
        const backupMember = this.buildBRPlan.get('backupTeamMember')?.value;
        if (backupMember && backupMember.id === selectedMember) {
          this.buildBRPlan.get('backupTeamMember')?.setValue(null);
        }
      });
  }
  formatTimeInput(event: any) {
    let inputValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters

    if (inputValue.length > 2) {
      inputValue =
        inputValue.substring(0, 2) + ':' + inputValue.substring(2, 4);
    }

    // Update form control with formatted value
    this.buildBRPlan.get('taskEstimates')?.setValue(inputValue);
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

  onAttachmentRemoved(event: boolean) {
    if (event) {
      this.uploadedFile = null;
      this.isAttachmentRemoved = true;
    }
  }

  clearFile(): void {
    this.uploadedFile = null;
    // this.isAttachmentRemoved = true;
  }
}
