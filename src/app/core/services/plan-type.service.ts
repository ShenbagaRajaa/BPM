import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, map } from 'rxjs';
import { environment } from '../../../environment/environment';
import { planType } from '../models/planType.model';

@Injectable({
  providedIn: 'root',
})
export class PlanTypeService {
  private apiUrl = environment.apiUrl + '/api/';

  constructor(private http: HttpClient) {}

  //Get all plan types
  getPlanTypes(): Observable<planType[]> {
    return this.http.get<planType[]>(this.apiUrl + 'PlanType/getall');
  }

  //Get plan type by ID
  getPlanType(PlanTypeId: number): Observable<planType> {
    return this.http.get<planType>(
      `${this.apiUrl}PlanType/getbyid?Id=${PlanTypeId}`
    );
  }

  //Add new plan type
  addPlanType(newPlanType: planType): Observable<planType[]> {
    return this.http
      .post<string>(`${this.apiUrl}PlanType/add`, newPlanType)
      .pipe(
        switchMap(() => {
          return this.getPlanTypes().pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }

  //Edit an existing plan type
  editPlanType(updatedData: planType): Observable<planType[]> {
    return this.http
      .put<string>(`${this.apiUrl}PlanType/update`, updatedData)
      .pipe(
        switchMap(() => {
          return this.getPlanTypes().pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }

  // Delete plan type by ID
  deletePlanType(PlanTypeId: number, userId: number): Observable<planType[]> {
    return this.http
      .delete<string>(
        `${this.apiUrl}PlanType/deletebyid?id=${PlanTypeId}&userId=${userId}`
      )
      .pipe(
        switchMap(() => {
          return this.getPlanTypes().pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }
}
