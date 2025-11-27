import { SequenceState } from './sequence.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
export const SEQUENCE_STATE_NAME = 'sequence';

const getSequenceState =
  createFeatureSelector<SequenceState>(SEQUENCE_STATE_NAME);

export const selectAllSequences = createSelector(getSequenceState, (state) => {
  return state.sequences;
});

export const selectSequence = createSelector(getSequenceState, (state) => {
  return state.sequence;
});

export const selectSequencesError = createSelector(
  getSequenceState,
  (state) => {
    return state.error;
  }
);

export const getSequenceMessage = createSelector(getSequenceState, (state) => {
  return state.message;
});
