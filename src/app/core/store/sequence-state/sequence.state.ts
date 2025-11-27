import { Sequence } from '../../models/Sequence.model';

export interface SequenceState {
  sequences: Sequence[];
  error: string;
  sequence: Sequence;
  message: string;
}

export const initialState: SequenceState = {
  sequences: [],
  error: '',
  message: '',
  sequence: {
    id: 0,
    brPlanId: 0,
    createdBy: 0,
    createdDate: new Date(),
    isDeleted: true,
    lastChangedBy: 0,
    lastChangedDate: new Date(),
    sequenceNumber: '',
    status: '',
    tasks: [],
  },
};
