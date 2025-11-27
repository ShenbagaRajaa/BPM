import { permission } from '../../models/permissions.model';

export interface PermissionState {
  Permissions: permission[];
  Permission: permission;
  permissionByRoleId: permission[];
  error: string;
  message: string;
}

export const initialState: PermissionState = {
  Permissions: [],
  error: '',
  message: '',
  Permission: {
    id: 0,
    permissionName: '',
    description: '',
  },
  permissionByRoleId: [],
};
