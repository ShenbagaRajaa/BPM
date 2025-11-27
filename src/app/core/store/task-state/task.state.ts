import { Task } from '../../models/task.model';

export interface TaskState {
  tasks: Task[];
  error: string;
  task: Task;
  message: string;
}

export const initialState: TaskState = {
  tasks: [],
  message: '',
  error: '',
  task: {
    planIdentifier: '',
    id: 0,
    sequenceId: '',
    taskIdentifier: '',
    taskDescription: '',
    taskTitle: '',
    status: '',
    primaryTeamMember: 0,
    backupTeamMember: 0,
    taskEstimates: '',
    actualResponseTimeinMins: '',
    actualTimetoCompletioninMins: '',
    acknowledgedBy: '',
    acknowledgedDate: '',
    completedBy: '',
    completedDate: '',
    reportedProblemBy: '',
    problemReportedDate: '',
    createdBy: 0,
  },
};
