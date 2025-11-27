import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DepartmentState } from './department.state';

export const DEPARTMENT_STATE_NAME = 'department';

const getDepartmentState = createFeatureSelector<DepartmentState>(
  DEPARTMENT_STATE_NAME
);

export const selectAllDepartments = createSelector(
  getDepartmentState,
  (state) => state.departments
);
export const selectDepartment = createSelector(
  getDepartmentState,
  (state) => state.department
);
export const selectDepartmentError = createSelector(
  getDepartmentState,
  (state) => state.error
);
export const selectDepartmentMessage = createSelector(
  getDepartmentState,
  (state) => state.message
);
