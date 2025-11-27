import { createAction, props } from '@ngrx/store';
import { department } from '../../models/department.model';

export const getDepartments = createAction('[Department] Get Departments');

export const getDepartmentsSuccess = createAction(
  '[Department] Get Departments Success',
  props<{ departments: department[] }>()
);

export const getDepartmentsFailure = createAction(
  '[Department] Get Departments Failure',
  props<{ error: string }>()
);

export const getDepartment = createAction(
  '[Department] Get Department',
  props<{ departmentId: number }>()
);

export const getDepartmentSuccess = createAction(
  '[Department] Get Department Success',
  props<{ department: department }>()
);

export const getDepartmentFailure = createAction(
  '[Department] Get Department Failure',
  props<{ error: string }>()
);

export const addDepartment = createAction(
  '[Department] Add Department',
  props<{ addDepartment: department }>()
);

export const addDepartmentSuccess = createAction(
  '[Department] Add Department Success',
  props<{ departments: department[] }>()
);

export const addDepartmentFailure = createAction(
  '[Department] Add Department Failure',
  props<{ error: string }>()
);

export const editDepartment = createAction(
  '[Department] Edit Department',
  props<{ editDepartment: department }>()
);

export const editDepartmentSuccess = createAction(
  '[Department] Edit Department Success',
  props<{ departments: department[] }>()
);

export const editDepartmentFailure = createAction(
  '[Department] Edit Department Failure',
  props<{ error: string }>()
);

export const deleteDepartment = createAction(
  '[Department] Delete Department',
  props<{ departmentId: number; userId: number }>()
);

export const deleteDepartmentSuccess = createAction(
  '[Department] Delete Department Success',
  props<{ departments: department[] }>()
);

export const deleteDepartmentFailure = createAction(
  '[Department] Delete Department Failure',
  props<{ error: string }>()
);
