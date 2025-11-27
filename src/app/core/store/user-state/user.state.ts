import { addUserModel } from '../../models/UserCreationTemp.model';
import { drSkill } from '../../models/drSkill.model';
import { drTeam } from '../../models/drTeam.model';
import { userbyrole } from '../../models/userByRole.model';

export interface UserState {
  users: addUserModel[];
  user: addUserModel;
  error: string;
  message: string;
  drTeam: drTeam[];
  drSkill: drSkill[];
  usersByRole: userbyrole[];
}

export const initialState: UserState = {
  users: [],
  error: '',
  message: '',
  drTeam: [],
  drSkill: [],
  usersByRole: [],
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
  },
};
