import { Task } from './task.model';

export interface Sequence {
  id: number
  brPlanId: number;
  createdBy: number;
  createdDate: Date;
  isDeleted: boolean;
  lastChangedBy: number;
  lastChangedDate: Date;
  sequenceNumber: string;
  status: string;
  tasks: Task[];
}
