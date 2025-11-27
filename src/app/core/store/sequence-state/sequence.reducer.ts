import { createReducer, on } from '@ngrx/store';
import { initialState } from './sequence.state';
import {
  getSequences,
  getSequencesSuccess,
  getSequencesFailure,
  getSequence,
  getSequenceSuccess,
  getSequenceFailure,
  addSequence,
  addSequenceFailure,
  addSequenceSuccess,
  editSequence,
  editSequenceFailure,
  editSequenceSuccess,
  deleteSequenceSuccess,
  deleteSequenceFailure,
  deleteSequence,
  dispatchSequence,
  dispatchSequenceFailure,
  dispatchSequenceSuccess,
  executeSequence,
  executeSequenceFailure,
  executeSequenceSuccess,
} from './sequence.action';

export const SequenceReducer = createReducer(
  initialState,

  on(getSequences, (state) => ({
    ...state,
    loading: false,
  })),
  on(getSequencesSuccess, (state, { sequences }) => ({
    ...state,
    loading: false,
    sequences: sequences,
  })),
  on(getSequencesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(getSequence, (state) => ({
    ...state,
    loading: false,
  })),
  on(getSequenceSuccess, (state, { sequence }) => ({
    ...state,
    loading: false,
    sequence: sequence,
  })),
  on(getSequenceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(addSequence, (state) => ({
    ...state,
    loading: false,
  })),
  on(addSequenceSuccess, (state, { sequences }) => ({
    ...state,
    loading: false,
    sequences,
  })),
  on(addSequenceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(editSequence, (state) => ({
    ...state,
    loading: false,
  })),
  on(editSequenceSuccess, (state, { sequences }) => ({
    ...state,
    loading: false,
    sequences,
  })),
  on(editSequenceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(deleteSequence, (state) => ({
    ...state,
    loading: true,
  })),
  on(deleteSequenceSuccess, (state, { sequences }) => ({
    ...state,
    loading: false,
    sequences,
  })),
  on(deleteSequenceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(dispatchSequence, (state) => ({
    ...state,
    loading: false,
  })),
  on(dispatchSequenceSuccess, (state, { sequences }) => ({
    ...state,
    loading: false,
    sequences,
  })),
  on(dispatchSequenceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(executeSequence, (state) => ({
    ...state,
    loading: false,
  })),
  on(executeSequenceSuccess, (state, { sequences }) => ({
    ...state,
    loading: false,
    sequences,
  })),
  on(executeSequenceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
