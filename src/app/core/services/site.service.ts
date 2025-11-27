import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, map } from 'rxjs';
import { environment } from '../../../environment/environment';
import { site } from '../models/site.model';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  private apiUrl = environment.apiUrl + '/api/';

  constructor(private http: HttpClient) {}

  // Get all sites
  getSites() : Observable<site[]> {
    return this.http.get<site[]>(`${this.apiUrl}Site/getall`)
  }

  // Get site by ID
  getSite(siteId : number): Observable<site> {
    return this.http.get<site>(`${this.apiUrl}Site/getbyid?Id=${siteId}`);
  }

  // Add new site
  addSite(newSite : site):Observable<site[]>{
    return this.http.post<string>(`${this.apiUrl}Site/add`, newSite).pipe(switchMap(() => {
      return this.getSites().pipe(
        map(sequences => {
          return sequences; 
        })
      );
    }));
  }

  // Edit an existing site
  editSite(Site : site):Observable<site[]>{
    return this.http.put<string>(`${this.apiUrl}Site/update`, Site).pipe(
      switchMap(() => {
        return this.getSites().pipe(
          map(sequences => {
            return sequences; 
          })
        );
      }),
    );
  }
 
  // Delete site by ID
  deleteSite(siteId : number, userId : number):Observable<site[]>{
    return this.http.delete<string>(`${this.apiUrl}Site/deletebyid?id=${siteId}&userId=${userId}`).pipe(
      switchMap(() => {
        return this.getSites().pipe(
          map(sequences => {
            return sequences; 
          })
        );
      }),
    );
  }
}
