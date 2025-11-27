import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { planLevel } from '../models/planLevel.model';

@Injectable({
  providedIn: 'root',
})
export class PlanLevelService {
  private apiUrl = environment.apiUrl + '/api/';

  constructor(private http: HttpClient) {}

  // Get all plan levels
  getPlanLevels(): Observable<planLevel[]> {
    return this.http.get<planLevel[]>(this.apiUrl + 'PlanLevel/getall');
  }

  // Get plan level by ID
  getPlanLevel(PlanLevelId: number): Observable<planLevel> {
    return this.http.get<planLevel>(
      `${this.apiUrl}PlanLevel/getbyid?Id=${PlanLevelId}`
    );
  }

  // Add new plan level
  addPlanLevel(newPlanLevel: planLevel): Observable<planLevel[]> {
    return this.http
      .post<string>(`${this.apiUrl}PlanLevel/add`, newPlanLevel)
      .pipe(
        switchMap(() => {
          return this.getPlanLevels().pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }

  // Edit an existing plan level
  editPlanLevel(updatedData: planLevel): Observable<planLevel[]> {
    return this.http
      .put<string>(`${this.apiUrl}PlanLevel/update`, updatedData)
      .pipe(
        switchMap(() => {
          return this.getPlanLevels().pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }

  // Delete plan level by ID
  deletePlanLevel(
    PlanLevelId: number,
    userId: number
  ): Observable<planLevel[]> {
    return this.http
      .delete<string>(
        `${this.apiUrl}PlanLevel/deletebyid?id=${PlanLevelId}&userId=${userId}`
      )
      .pipe(
        switchMap(() => {
          return this.getPlanLevels().pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }
}
