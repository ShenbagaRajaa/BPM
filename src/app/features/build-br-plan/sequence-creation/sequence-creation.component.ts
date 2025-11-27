import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { sequenceAdd } from '../../../core/models/sequenceAdd.model';
import { appState } from '../../../core/store/app-state/app.state';
import { selectUser } from '../../../core/store/auth-state/auth.selector';
import {
  addSequence,
  editSequence,
  getSequence,
  getSequences,
} from '../../../core/store/sequence-state/sequence.action';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { NavigationbarComponent } from '../../../shared/navigationbar/navigationbar.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { selectSequence } from '../../../core/store/sequence-state/sequence.selector';
import { sequenceUpdate } from '../../../core/models/sequenceUpdate.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sequence-creation',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputFieldComponent,
    NavigationbarComponent,
    MatButtonModule, MatIconModule, MatDialogModule
  ],
  templateUrl: './sequence-creation.component.html',
  styleUrl: './sequence-creation.component.css',
})
export class SequenceCreationComponent {
  pageTitle: string = 'Create Sequence';
  createSequence!: FormGroup;
  saveButtonDisabled: boolean = true;
  button: string = 'ADD SEQUENCE';

  constructor(
    private store: Store<appState>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { planId: number; sequenceId: number },
    private dialogRef: MatDialogRef<SequenceCreationComponent>
  ) {}

  ngOnInit() {
    this.createSequence = this.fb.group({
      sequenceNumber: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(10)]],
    });

    this.getData();
  }

  addNewSequence() {
    // Get user ID from store
    let createdBy = 0;
    this.store.select(selectUser).subscribe((data) => {
      createdBy = data.user.id;
    });
    // Define new sequence object
    let newSequence: sequenceAdd = {
      brPlanId: this.data.planId,
      createdBy: createdBy,
      sequenceNumber: this.createSequence?.get('sequenceNumber')?.value,
      status: 'SequenceBuildStarted',
      createdDate: new Date(),
      isDeleted: true,
      lastChangedBy: createdBy,
      lastChangedDate: new Date(),
    };

    // Define update sequence object
    let updateSequence: sequenceUpdate = {
      sequenceNumber: this.createSequence?.get('sequenceNumber')?.value,
      status: 'SequenceBuildStarted',
      lastChangedBy: createdBy,
      id: this.data.sequenceId,
    };

    // Dispatch appropriate action based on sequence ID
    if (this.data.sequenceId)
      this.store.dispatch(
        editSequence({ editSequence: updateSequence, planId: this.data.planId })
      );
    else
      this.store.dispatch(
        addSequence({ addSequence: newSequence, planId: this.data.planId })
      );
    // Refresh sequences list and close dialog
    this.store.dispatch(getSequences({ planId: this.data.planId }));
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

  ngOnChanges() {
    this.getData();
  }

  getData() {
    if (this.data.sequenceId) {
      this.button = 'UPDATE';
      this.pageTitle = 'Update Sequence';
      // Fetch sequence details from store
      this.store.dispatch(getSequence({ sequenceId: this.data.sequenceId }));
      this.store.select(selectSequence).subscribe((sequence) => {
        this.createSequence.patchValue({
          sequenceNumber: sequence.sequenceNumber,
        });
      });
    }
    // Enable/disable save button based on form validity
    this.createSequence.statusChanges.subscribe((status) => {
      this.saveButtonDisabled = status !== 'VALID';
    });
  }
}
