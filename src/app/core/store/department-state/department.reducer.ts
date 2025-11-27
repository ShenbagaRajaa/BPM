import { createReducer, on } from '@ngrx/store';
import { initialState } from './department.state';
import {
  addDepartment,
  addDepartmentFailure,
  addDepartmentSuccess,
  deleteDepartment,
  deleteDepartmentFailure,
  deleteDepartmentSuccess,
  editDepartment,
  editDepartmentFailure,
  editDepartmentSuccess,
  getDepartment,
  getDepartmentFailure,
  getDepartments,
  getDepartmentsFailure,
  getDepartmentsSuccess,
  getDepartmentSuccess,
} from './department.action';

export const DepartmentReducer = createReducer(
  initialState,
  on(getDepartments, (state) => ({
    ...state,
    loading: false,
  })),
  on(getDepartmentsSuccess, (state, { departments }) => ({
    ...state,
    loading: false,
    departments: departments,
  })),
  on(getDepartmentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(getDepartment, (state) => ({
    ...state,
    loading: true,
  })),
  on(getDepartmentSuccess, (state, { department }) => ({
    ...state,
    loading: false,
    department: department,
  })),
  on(getDepartmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(addDepartment, (state) => ({
    ...state,
    loading: false,
  })),
  on(addDepartmentSuccess, (state, { departments }) => ({
    ...state,
    loading: false,
    departments,
  })),
  on(addDepartmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(editDepartment, (state) => ({
    ...state,
    loading: false,
  })),
  on(editDepartmentSuccess, (state, { departments }) => ({
    ...state,
    loading: false,
    departments,
  })),
  on(editDepartmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(deleteDepartment, (state) => ({
    ...state,
    loading: false,
  })),
  on(deleteDepartmentSuccess, (state, { departments }) => ({
    ...state,
    loading: false,
    departments,
  })),
  on(deleteDepartmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
