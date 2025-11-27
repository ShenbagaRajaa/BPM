import { addUserModel } from './UserCreationTemp.model';

export interface loginResponse {
  user: addUserModel;
  token: string;
}
