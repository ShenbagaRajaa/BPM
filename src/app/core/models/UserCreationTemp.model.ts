export interface addUserModel {
  id: number;
  title: string;
  employeeFirstName: string;
  employeeLastName?:string;
  drTeamId: number;
  drTeamSkill: string;
  email: string;
  mobileNumber: string;
  role: number | string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  emergencyContactName: string;
  emergencyContactEmail: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  isActive: boolean;
  profilePicture?: File | null;
  address2?: string;
  createdBy: number;
  uploadPhotoPath: string;  
  permissionIds: string;
  lastChangedBy: number;
  accountLocked?: boolean;
  isPasswordSetByUser? : boolean | undefined
}
