import { createAction, props } from '@ngrx/store';
import { Sequence } from '../../models/Sequence.model';
import { sequenceAdd } from '../../models/sequenceAdd.model';
import { sequenceUpdate } from '../../models/sequenceUpdate.model';

export const getSequences = createAction(
  '[Sequence] Get Sequences',
  props<{ planId: number }>()
);

export const getSequencesSuccess = createAction(
  '[Sequence] Get Sequences Success',
  props<{ sequences: Sequence[] }>()
);

export const getSequencesFailure = createAction(
  '[Sequence] Get Sequences Failure',
  props<{ error: string }>()
);

export const getSequence = createAction(
  '[Sequence] Get Sequence',
  props<{ sequenceId: number }>()
);

export const getSequenceSuccess = createAction(
  '[Sequence] Get Sequence Success',
  props<{ sequence: Sequence }>()
);

export const getSequenceFailure = createAction(
  '[Sequence] Get Sequence Failure',
  props<{ error: string }>()
);

export const addSequence = createAction(
  '[Sequence] Add Sequence',
  props<{ addSequence: sequenceAdd; planId: number }>()
);

export const addSequenceSuccess = createAction(
  '[Sequence] Add Sequence Success',
  props<{ sequences: Sequence[] }>()
);

export const addSequenceFailure = createAction(
  '[Sequence] Add Sequence Failure',
  props<{ error: string }>()
);

export const editSequence = createAction(
  '[Sequence] Edit Sequence',
  props<{ editSequence: sequenceUpdate; planId: number }>()
);

export const editSequenceSuccess = createAction(
  '[Sequence] Edit Sequence Success',
  props<{ sequences: Sequence[] }>()
);

export const editSequenceFailure = createAction(
  '[Sequence] Edit Sequence Failure',
  props<{ error: string }>()
);

export const deleteSequence = createAction(
  '[Sequence] Delete Sequence',
  props<{ sequenceId: number; planId: number }>()
);

export const deleteSequenceSuccess = createAction(
  '[Sequence] Delete Sequence Success',
  props<{ sequences: Sequence[] }>()
);

export const deleteSequenceFailure = createAction(
  '[Sequence] Delete Sequence Failure',
  props<{ error: string }>()
);

export const dispatchSequence = createAction(
  '[Sequence] dispatch Sequence',
  props<{ sequenceId: number; lastChangedBy: number; planId: number }>()
);

export const dispatchSequenceSuccess = createAction(
  '[Sequence] dispatch Sequence Success',
  props<{ sequences: Sequence[] }>()
);

export const dispatchSequenceFailure = createAction(
  '[Sequence] dispatch Sequence Failure',
  props<{ error: string }>()
);

export const executeSequence = createAction(
  '[Sequence] execute Sequence',
  props<{ PlanId: number; lastChangedBy: number; successMessage: string }>()
);

export const executeSequenceSuccess = createAction(
  '[Sequence] execute Sequence Success',
  props<{ sequences: Sequence[] }>()
);

export const executeSequenceFailure = createAction(
  '[Sequence] execute Sequence Failure',
  props<{ error: string }>()
);
