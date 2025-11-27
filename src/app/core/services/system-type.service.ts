import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { systemType } from '../models/systemType.model';
import { appState } from '../store/app-state/app.state';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SystemTypeService {
  private apiUrl = environment.apiUrl + '/api/';

  constructor(private http: HttpClient, private store: Store<appState>) {}

  // Get all system types
  getSystemTypes(): Observable<systemType[]> {
    return this.http.get<systemType[]>(this.apiUrl + 'SystemType/getall');
  }

  // Get system type by ID
  getSystemType(SystemTypeId: number): Observable<systemType> {
    return this.http.get<systemType>(
      `${this.apiUrl}SystemType/getbyid?Id=${SystemTypeId}`
    );
  }

  // Add new system type
  addSystemType(newSystemType: systemType): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}SystemType/add`,
      newSystemType
    );
  }

  // Edit an existing system type
  editSystemType(SystemType: systemType): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}SystemType/update`, SystemType);
  }

  // Delete system type by ID
  deleteSystemType(SystemTypeId: number, userId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.apiUrl}SystemType/deletebyid?id=${SystemTypeId}&userId=${userId}`
    );
  }
}
