import { role } from '../../models/role.model';

export interface RoleState {
  roles: role[];
  role: role;
  error: string;
  message: string;
}

export const initialState: RoleState = {
  roles: [],
  role: { id: 0, roleName: '', createdBy: 0, lastChangedBy: 0, status: true },
  error: '',
  message: '',
};
