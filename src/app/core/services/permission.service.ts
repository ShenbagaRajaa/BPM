import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { permission } from '../models/permissions.model';
import { HttpClient } from '@angular/common/http';
import { permissionByRole } from '../models/permissionByRole.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private apiUrl = environment.apiUrl + '/api/';

  constructor(private http: HttpClient) {}

  //Retrieves all permissions.
  getPermissions(): Observable<permission[]> {
    return this.http.get<permission[]>(`${this.apiUrl}Permission/getall`);
  }

  //Retrieves a specific permission by ID.
  getPermission(permissionId: number): Observable<permission> {
    return this.http.get<permission>(
      `${this.apiUrl}Permission/getbyid?Id=${permissionId}`
    );
  }

  // Retrieves permissions associated with a specific role.
  getPermissionsByRoleId(id: number): Observable<permission[]> {
    return this.http.get<permission[]>(
      `${this.apiUrl}RolePermission/getrolepermissionsbyroleid?roleId=` + id
    );
  }

  // Adds permissions to a role.
  addPermissionByRoleId(newRole: permissionByRole): Observable<permission[]> {
    return this.http.post<permission[]>(
      `${this.apiUrl}RolePermission/addpermissions`,
      newRole
    );
  }

  // Updates permissions for a role.
  editPermissionByRoleId(newRole: permissionByRole): Observable<permission[]> {
    return this.http.post<permission[]>(
      `${this.apiUrl}RolePermission/updatepermissions`,
      newRole
    );
  }
}
