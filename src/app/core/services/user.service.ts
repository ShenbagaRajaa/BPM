import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { addUserModel } from '../models/UserCreationTemp.model';
import {
  Observable,
  catchError,
  map,
  of,
  switchMap,
  throwError,
  Subject,
} from 'rxjs';
import { environment } from '../../../environment/environment';
import { drTeam } from '../models/drTeam.model';
import { drSkill } from '../models/drSkill.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiurl: string = environment.apiUrl + '/api/';

  private refreshUserListSource = new Subject<void>();
  refreshUserList$ = this.refreshUserListSource.asObservable();

  constructor(private http: HttpClient) {}

  // Get all users
  getAllUser(): Observable<addUserModel[]> {
    return this.http.get<addUserModel[]>(`${this.apiurl}User/getall`);
  }

  // Get user by email
  getUserByEmail(email: string): Observable<addUserModel> {
    return this.http.get<addUserModel>(
      `${this.apiurl}User/getbyemail?EmailId=${email}`
    );
  }

  // Get DR team by ID
  getDrTeam(id: number): Observable<drTeam[]> {
    return this.http.post<drTeam[]>(
      `${this.apiurl}DRTeam/getbycreateduserid?userId=${id}`,
      3
    );
  }

  // Get DR skill by ID
  getDrSkill(teamId: number): Observable<drSkill[]> {
    return this.http.post<drSkill[]>(
      `${this.apiurl}DRSkill/getbydrteamid?drTeamId=${teamId}`,
      teamId
    );
  }

  // Get some user by role ID
  getByRoleId(teamId: number): Observable<addUserModel[]> {
    return this.http.get<addUserModel[]>(
      `${this.apiurl}User/getbyroleid?roleId=${teamId}`
    );
  }

  // Update a profile for the user (Created / Updated)
  uploadUserImage(
    id: number,
    name: string,
    file?: File | null
  ): Observable<string> {
    if (file) {
      const formData = new FormData();
      formData.append('profilepicture', file);
      return this.http
        .post<string>(
          `${this.apiurl}User/UploadUserImage?id=${id}&name=${name}`,
          formData
        )
        .pipe(
          map(() => {
            this.refreshUserListSource.next();
            return 'Image uploaded successfully';
          }),
          catchError(() => {
            return throwError(() => new Error('Image upload failed.'));
          })
        );
    } else {
      return of('No file provided for upload.');
    }
  }

  // Add new user
  addUser(addUser: addUserModel): Observable<addUserModel[]> {
    return this.http.post<string>(`${this.apiurl}User/create`, addUser).pipe(
      switchMap(() =>
        this.getUserByEmail(addUser.email).pipe(
          catchError(() => {
            return throwError(() => new Error('User fetch failed'));
          })
        )
      ),
      switchMap((data) =>
        this.uploadUserImage(
          data.id,
          data.employeeFirstName,
          addUser.profilePicture
        ).pipe(
          catchError(() => {
            return throwError(() => new Error('Image upload failed'));
          }),
          map(() => data)
        )
      ),
      switchMap(() =>
        this.getAllUser().pipe(
          catchError(() => {
            return throwError(() => new Error('Fetching users failed'));
          })
        )
      )
    );
  }

  // Edit an existing user
  updateUser(updateUser: addUserModel): Observable<addUserModel[]> {
    return this.http.put<string>(`${this.apiurl}User/update`, updateUser).pipe(
      switchMap(() =>
        this.getUserByEmail(updateUser.email).pipe(
          catchError(() => {
            return throwError(() => new Error('User fetch failed.'));
          })
        )
      ),
      switchMap((data) =>
        updateUser.profilePicture
          ? this.uploadUserImage(
              data.id,
              data.employeeFirstName,
              updateUser.profilePicture
            ).pipe(
              catchError(() => {
                return throwError(() => new Error('Image upload failed.'));
              })
            )
          : of(data)
      ),
      switchMap(() =>
        this.getAllUser().pipe(
          catchError(() => {
            return throwError(() => new Error('Fetching all users failed.'));
          })
        )
      )
    );
  }

  // Delete user by ID
  deleteUser(userId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiurl}User/delete?id=${userId}`);
  }

  unlockUesrAccount(email: string): Observable<string> {
    return this.http.put<string>(`${this.apiurl}User/unlock?email=${email}`, email);
  }
}
