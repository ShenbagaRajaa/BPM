import { createReducer, on } from '@ngrx/store';
import { initialState } from './task.state';
import {
  addTask,
  addTaskFailure,
  addTaskSuccess,
  deleteTask,
  deleteTaskFailure,
  deleteTaskSuccess,
  editTask,
  editTaskFailure,
  editTaskSuccess,
  getTask,
  getTaskFailure,
  getTaskProblemDetail,
  getTaskProblemDetailFailure,
  getTaskProblemDetailSuccess,
  getTaskSuccess,
  getTasks,
  getTasksFailure,
  getTasksSuccess,
  resolveTaskProblem,
  resolveTaskProblemFailure,
  resolveTaskProblemSuccess,
  taskAcknowledgeFailure,
  taskAcknowledgeSuccess,
  taskAcknowledges,
  taskCompletion,
  taskCompletionFailure,
  taskCompletionSuccess,
  taskProblemReporting,
  taskProblemReportingFailure,
  taskProblemReportingSuccess,
} from './task.action';

export const TaskReducer = createReducer(
  initialState,

  on(getTasks, (state) => ({
    ...state,
    loading: false,
  })),
  on(getTasksSuccess, (state, { tasks }) => ({
    ...state,
    loading: false,
    tasks: tasks,
  })),
  on(getTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(getTask, (state) => ({
    ...state,
    loading: false,
  })),
  on(getTaskSuccess, (state, { task }) => ({
    ...state,
    loading: false,
    task: task,
  })),
  on(getTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(addTask, (state) => ({
    ...state,
    loading: false,
  })),
  on(addTaskSuccess, (state, { tasks }) => ({
    ...state,
    loading: false,
    tasks,
  })),
  on(addTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(editTask, (state) => ({
    ...state,
    loading: false,
  })),
  on(editTaskSuccess, (state, { tasks }) => ({
    ...state,
    loading: false,
    tasks,
  })),
  on(editTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(deleteTask, (state) => ({
    ...state,
    loading: false,
  })),
  on(deleteTaskSuccess, (state, { tasks }) => ({
    ...state,
    loading: false,
    tasks,
  })),
  on(deleteTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(taskAcknowledges, (state) => ({
    ...state,
    loading: false,
  })),
  on(taskAcknowledgeSuccess, (state, { task }) => ({
    ...state,
    loading: false,
    task,
  })),
  on(taskAcknowledgeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(taskProblemReporting, (state) => ({
    ...state,
    loading: true,
  })),
  on(taskProblemReportingSuccess, (state, { task }) => ({
    ...state,
    loading: false,
    task,
  })),
  on(taskProblemReportingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(taskCompletion, (state) => ({
    ...state,
    loading: false,
  })),
  on(taskCompletionSuccess, (state, { task }) => ({
    ...state,
    loading: false,
    task,
  })),
  on(taskCompletionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(resolveTaskProblem, (state) => ({
    ...state,
    loading: true,
  })),
  on(resolveTaskProblemSuccess, (state, { tasks }) => ({
    ...state,
    loading: false,
    tasks,
  })),
  on(resolveTaskProblemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(getTaskProblemDetail, (state) => ({
    ...state,
    loading: true,
  })),
  on(getTaskProblemDetailSuccess, (state, { task }) => ({
    ...state,
    loading: false,
    task,
  })),
  on(getTaskProblemDetailFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
