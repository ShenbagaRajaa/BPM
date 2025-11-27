import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationSetting } from '../models/defaultConfig.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationSettingsService {
  private apiUrl = `${environment.apiUrl}/api/DefaultSettings`;

  constructor(private http: HttpClient) {}

  /**
   * Get all configuration settings.
   * @returns Observable of an array of ConfigurationSetting objects.
   */
  getAllConfigurations(): Observable<ConfigurationSetting[]> {
    return this.http.get<ConfigurationSetting[]>(`${this.apiUrl}/getall`);
  }

  /**
   * Get a configuration setting by its ID.
   * @param id - The ID of the configuration setting to retrieve.
   * @returns Observable of a single ConfigurationSetting object.
   */
  getConfiguration(id: number): Observable<ConfigurationSetting> {
    return this.http.get<ConfigurationSetting>(
      `${this.apiUrl}/getbyid?Id=${id}`
    );
  }

  /**
   * Add a new configuration setting.
   * @param newConfig - The new configuration setting to be added.
   * @returns Observable of a string message (e.g., success or error).
   */
  addConfiguration(newConfig: ConfigurationSetting): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/add`, newConfig);
  }

  /**
   * Update an existing configuration setting.
   * @param updatedConfig - The configuration setting with updated data.
   * @returns Observable of a string message (e.g., success or error).
   */
  updateConfiguration(updatedConfig: ConfigurationSetting): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/update`, updatedConfig);
  }

  deleteConfiguration(settingId: number, userId: number): Observable<string> {
    return this.http
      .delete<string>(
        `${this.apiUrl}/deletebyid?id=${settingId}&userId=${userId}`
      );
  }
  
}
