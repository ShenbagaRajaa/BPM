import { addUserModel } from '../../models/UserCreationTemp.model';

// Define the structure of the authentication state
export interface AuthState {
  user: addUserModel;
  error: string;
  message: string;
  token: string;
  permissionIds: string[];
  loading: boolean;
}

// Initial state for authentication
export const initialState: AuthState = {
  error: '',
  message: '',
  token: '',
  loading: false,
  permissionIds: [],
  user: {
    id: 0,
    title: '',
    employeeFirstName: '',
    employeeLastName: '',
    drTeamId: 0,
    drTeamSkill: '',
    email: '',
    mobileNumber: '',
    role: 0,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    emergencyContactName: '',
    emergencyContactEmail: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    isActive: true,
    profilePicture: null,
    address2: '',
    createdBy: 0,
    uploadPhotoPath: '',
    permissionIds: '',
    lastChangedBy: 0,
    isPasswordSetByUser: undefined,
  },
};
