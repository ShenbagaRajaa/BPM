import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { drSkill } from '../models/drSkill.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private apiUrl = `${environment.apiUrl}/api/`;

  constructor(private http: HttpClient) {}

  // Get all DR skills
  getSkills(): Observable<drSkill[]> {
    return this.http.get<drSkill[]>(`${this.apiUrl}DRSkill/getall`);
  }

  // Get DR skill by ID
  getSkill(skillId: number): Observable<drSkill> {
    return this.http.get<drSkill>(
      `${this.apiUrl}DRSkill/getbyid?Id=${skillId}`
    );
  }

  // Add new DR skill
  addSkill(newSkill: drSkill): Observable<drSkill[]> {
    return this.http.post<drSkill[]>(`${this.apiUrl}DRSkill/add`, newSkill);
  }

  // Edit an existing DR skill
  editSkill(updatedSkill: drSkill): Observable<drSkill[]> {
    return this.http.put<drSkill[]>(
      `${this.apiUrl}DRSkill/update`,
      updatedSkill
    );
  }

  // Delete DR skill by ID
  deleteSkill(skillId: number, userId: number): Observable<drSkill[]> {
    return this.http.delete<drSkill[]>(
      `${this.apiUrl}DRSkill/deletebyid?id=${skillId}&userId=${userId}`
    );
  }
}
