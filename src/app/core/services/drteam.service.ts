import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { drTeam } from '../models/drTeam.model';

@Injectable({
  providedIn: 'root',
})
export class DrteamService {
  private apiUrl = environment.apiUrl + '/api/';

  constructor(private http: HttpClient) {}

  /**
   * Get a list of all DR teams.
   * @returns Observable of an array of DR team objects.
   */
  getDRTeams(): Observable<drTeam[]> {
    return this.http.get<drTeam[]>(this.apiUrl + 'DRTeam/getall');
  }

  /**
   * Get details of a specific DR team by its ID.
   * @param DRTeamId - The ID of the DR team.
   * @returns Observable of a single DR team object.
   */
  getDRTeam(DRTeamId: number): Observable<drTeam> {
    return this.http.get<drTeam>(`${this.apiUrl}DRTeam/getbyid?Id=${DRTeamId}`);
  }

  /**
   * Add a new DR team.
   * @param newDRTeam - The new DR team to be added.
   * @returns Observable of a string message (e.g., success message).
   */
  addDRTeam(newDRTeam: drTeam): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}DRTeam/add`, newDRTeam);
  }

  /**
   * Edit an existing DR team.
   * @param dRTeam - The DR team with updated values.
   * @returns Observable of a string message (e.g., success message).
   */
  editDRTeam(dRTeam: drTeam): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}DRTeam/update`, dRTeam);
  }

  /**
   * Delete a DR team by its ID.
   * @param DRTeamId - The ID of the DR team to be deleted.
   * @param userId - The ID of the user performing the deletion.
   * @returns Observable of a string message (e.g., success message).
   */
  deleteDRTeam(DRTeamId: number, userId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.apiUrl}DRTeam/deletebyid?id=${DRTeamId}&userId=${userId}`
    );
  }
}
