import { TaskState } from './task.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
export const TASK_STATE_NAME = 'task';

const getTaskState = createFeatureSelector<TaskState>(TASK_STATE_NAME);

export const selectAllTasks = createSelector(getTaskState, (state) => {
  return state.tasks;
});

export const selectTask = createSelector(getTaskState, (state) => {
  return state.task;
});

export const selectTaskError = createSelector(getTaskState, (state) => {
  return state.error;
});

export const selectTaskMessage = createSelector(getTaskState, (state) => {
  return state.message;
});

export const selectResolvedTask = createSelector(getTaskState, (state) => {
  return state.task;
});

export const selectResolvedTaskMessage = createSelector(
  getTaskState,
  (state) => {
    return state.message;
  }
);
export const selectTaskProblemDetail = createSelector(
  getTaskState,
  (state) => state.task
);

export const selectTaskProblemError = createSelector(
  getTaskState,
  (state) => state.error
);
