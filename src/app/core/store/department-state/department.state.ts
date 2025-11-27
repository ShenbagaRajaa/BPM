import { department } from '../../models/department.model';

export interface DepartmentState {
  departments: department[];
  department: department;
  error: string;
  message: string;
}

export const initialState: DepartmentState = {
  departments: [],
  error: '',
  message: '',
  department: {
    id: 0,
    departmentCode: '',
    departmentName: '',
    status: true,
    lastChangedBy: 0,
    lastChangedDate: '',
  },
};
