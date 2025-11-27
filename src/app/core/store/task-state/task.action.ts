import { createAction, props } from '@ngrx/store';
import { Task } from '../../models/task.model';
import { taskAdd } from '../../models/taskAdd.model';
import { taskAcknowledgeModel } from '../../models/taskAcknowledge.model';

export const getTasks = createAction(
  '[Task] Get Tasks',
  props<{ sequenceId: number }>()
);

export const getTasksSuccess = createAction(
  '[Task] Get Tasks Success',
  props<{ tasks: Task[] }>()
);

export const getTasksFailure = createAction(
  '[Task] Get Tasks Failure',
  props<{ error: string }>()
);

export const getTask = createAction(
  '[Task] Get Task',
  props<{ taskId: number }>()
);

export const getTaskSuccess = createAction(
  '[Task] Get Task Success',
  props<{ task: Task }>()
);

export const getTaskFailure = createAction(
  '[Task] Get Task Failure',
  props<{ error: string }>()
);

export const addTask = createAction(
  '[Task] Add Task',
  props<{ addTask: taskAdd }>()
);

export const addTaskSuccess = createAction(
  '[Task] Add Task Success',
  props<{ tasks: Task[] }>()
);

export const addTaskFailure = createAction(
  '[Task] Add Task Failure',
  props<{ error: string }>()
);

export const editTask = createAction(
  '[Task] Edit Task',
  props<{ editTask: taskAdd }>()
);

export const editTaskSuccess = createAction(
  '[Task] Edit Task Success',
  props<{ tasks: Task[] }>()
);

export const editTaskFailure = createAction(
  '[Task] Edit Task Failure',
  props<{ error: string }>()
);

export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ taskId: number; sequenceId: number }>()
);

export const deleteTaskSuccess = createAction(
  '[Task] Delete Task Success',
  props<{ tasks: Task[] }>()
);

export const deleteTaskFailure = createAction(
  '[Task] Delete Task Failure',
  props<{ error: string }>()
);

export const taskAcknowledges = createAction(
  '[Task] Acknowledge Task',
  props<{ taskAck: taskAcknowledgeModel }>()
);

export const taskAcknowledgeSuccess = createAction(
  '[Task] Acknowledge Task Success',
  props<{ task: Task }>()
);

export const taskAcknowledgeFailure = createAction(
  '[Task] Acknowledge Task Failure',
  props<{ error: string }>()
);

export const taskProblemReporting = createAction(
  '[Sequence] Task Reporting Problem',
  props<{
    taskId: number;
    message: string;
    lastChangedBy: number;
    file?: File;
  }>()
);

export const taskProblemReportingSuccess = createAction(
  '[Sequence] Task Reporting Problem Success',
  props<{ task: Task }>()
);

export const taskProblemReportingFailure = createAction(
  '[Sequence] Task Reporting Problem Failure',
  props<{ error: string }>()
);

export const taskCompletion = createAction(
  '[Sequence] Task Completion',
  props<{ taskId: number; status: string; lastChangedBy: number }>()
);

export const taskCompletionSuccess = createAction(
  '[Sequence] Task Completion Success',
  props<{ task: Task }>()
);

export const taskCompletionFailure = createAction(
  '[Sequence] Task Completion Failure',
  props<{ error: string }>()
);

export const resolveTaskProblem = createAction(
  '[Task] Resolve Task Problem',
  props<{
    id: number;
    taskId: number;
    message: string;
    lastChangedBy: number;
    sequenceId: number;
    file?: File;
  }>()
);

export const resolveTaskProblemSuccess = createAction(
  '[Task] Resolve Task Problem Success',
  props<{ tasks: Task[] }>()
);

export const resolveTaskProblemFailure = createAction(
  '[Task] Resolve Task Problem Failure',
  props<{ error: string }>()
);

export const getTaskProblemDetail = createAction(
  '[Task] Get Task Problem Detail',
  props<{ taskId: number }>()
);

export const getTaskProblemDetailSuccess = createAction(
  '[Task] Get Task Problem Detail Success',
  props<{ task: Task }>()
);

export const getTaskProblemDetailFailure = createAction(
  '[Task] Get Task Problem Detail Failure',
  props<{ error: string }>()
);
