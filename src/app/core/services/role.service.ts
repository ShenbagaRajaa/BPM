import { Injectable } from '@angular/core';
import { role } from '../models/role.model';
import { Observable, switchMap, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { PermissionService } from './permission.service';
import { permissionByRole } from '../models/permissionByRole.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = environment.apiUrl + '/api/';

  constructor(
    private http: HttpClient,
    private permissionService: PermissionService
  ) {}

  // Get all roles
  getRoles(): Observable<role[]> {
    return this.http.get<role[]>(`${this.apiUrl}Role/getall`);
  }

  // Get role by ID
  getRole(RoleId: number): Observable<role> {
    return this.http.get<role>(`${this.apiUrl}Role/getbyid?Id=${RoleId}`);
  }

  // Add new role
  addRole(newRole: role, selectedPermissions: number[]): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}Role/add`, newRole).pipe(
      switchMap(() => {
        return this.getRoles().pipe(
          switchMap((roles) => {
            const newPermission: permissionByRole = {
              roleId: roles[0].id,
              permissionIds: selectedPermissions,
            };
            return this.permissionService
              .addPermissionByRoleId(newPermission)
              .pipe(
                catchError(() => {
                  return throwError(() => new Error('Add Permission Failed'));
                }),
                map(() => 'Added')
              );
          })
        );
      })
    );
  }

  // Edit an existing role
  editRole(Role: role, selectedPermissions: number[]): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}Role/update`, Role).pipe(
      switchMap(() => {
        const newPermission: permissionByRole = {
          roleId: Role.id,
          permissionIds: selectedPermissions,
        };
        return this.permissionService.addPermissionByRoleId(newPermission).pipe(
          catchError(() => {
            return throwError(() => new Error('Add Permission Failed'));
          }),
          map(() => 'Added')
        );
      })
    );
  }

  // Delete role by ID
  deleteRole(RoleId: number, userId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.apiUrl}Role/deletebyid?id=${RoleId}&userId=${userId}`
    );
  }
}
