import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { system } from '../models/system.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SystemService {
  private apiUrl = environment.apiUrl + '/api/';

  constructor(private http: HttpClient) {}

  // Get all sytems
  getSystems(): Observable<system[]> {
    return this.http.get<system[]>(this.apiUrl + 'System/getall');
  }

  // Get system by ID
  getSystem(SystemId: number): Observable<system> {
    return this.http.get<system>(`${this.apiUrl}System/getbyid?Id=${SystemId}`);
  }

  // Add new system
  addSystem(newSystem: system): Observable<system[]> {
    return this.http.post<string>(`${this.apiUrl}System/add`, newSystem).pipe(
      switchMap(() => {
        return this.getSystems().pipe(
          map((sequences) => {
            return sequences;
          })
        );
      })
    );
  }

  //Edit an existing system
  editSystem(System: system): Observable<system[]> {
    return this.http.put<string>(`${this.apiUrl}System/update`, System).pipe(
      switchMap(() => {
        return this.getSystems().pipe(
          map((sequences) => {
            return sequences;
          })
        );
      })
    );
  }

  // Delete system by ID
  deleteSystem(SystemId: number, userId: number): Observable<system[]> {
    return this.http
      .delete<string>(
        `${this.apiUrl}System/deletebyid?id=${SystemId}&userId=${userId}`
      )
      .pipe(
        switchMap(() => {
          return this.getSystems().pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }
}
