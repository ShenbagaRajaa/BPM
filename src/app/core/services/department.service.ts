import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { department } from '../models/department.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = environment.apiUrl + '/api/';

  constructor(private http: HttpClient) {}

  /**
   * Get a list of all departments.
   * @returns Observable of an array of department objects.
   */
  getDepartments(): Observable<department[]> {
    return this.http.get<department[]>(this.apiUrl + 'Department/getall');
  }

  /**
   * Get details of a specific department by its ID.
   * @param departmentId - The ID of the department.
   * @returns Observable of a single department object.
   */
  getDepartment(departmentId: number): Observable<department> {
    return this.http.get<department>(
      `${this.apiUrl}department/getbyid?Id=${departmentId}`
    );
  }

  /**
   * Add a new department and refresh the department list.
   * @param newDepartment - The new department to be added.
   * @returns Observable of an array of updated department objects.
   */
  addDepartment(newDepartment: department): Observable<department[]> {
    return this.http
      .post<string>(`${this.apiUrl}department/add`, newDepartment)
      .pipe(
        switchMap(() => {
          return this.getDepartments().pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }

  /**
   * Edit an existing department and refresh the department list.
   * @param editDepartmentValues - The department with updated values.
   * @returns Observable of an array of updated department objects.
   */
  editDepartment(editDpartmentValues: department): Observable<department[]> {
    return this.http
      .put<string>(`${this.apiUrl}department/update`, editDpartmentValues)
      .pipe(
        switchMap(() => {
          return this.getDepartments().pipe(
            map((departments) => {
              return departments;
            })
          );
        })
      );
  }

  /**
   * Delete a department by its ID and refresh the department list.
   * @param departmentId - The ID of the department to be deleted.
   * @param userId - The ID of the user requesting the deletion.
   * @returns Observable of an array of updated department objects.
   */
  deleteDepartment(
    departmentId: number,
    userId: number
  ): Observable<department[]> {
    return this.http
      .delete<string>(
        `${this.apiUrl}department/deletebyid?id=${departmentId}&userId=${userId}`
      )
      .pipe(
        switchMap(() => {
          return this.getDepartments().pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }
}
