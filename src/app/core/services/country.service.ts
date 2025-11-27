import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { country } from '../models/country.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private apiUrl = environment.apiUrl + '/api/';

  constructor(private http: HttpClient) {}

  /**
   * Get the list of all countries.
   * @returns Observable of an array of country objects.
   */
  getCountry(): Observable<country[]> {
    return this.http.get<country[]>(this.apiUrl + 'Country/getall');
  }

  /**
   * Get a list of states by country name.
   * @param countryName - The name of the country to get states for.
   * @returns Observable of an array of country objects (states).
   */
  getStateByCountry(countryName: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}Country/getstatebycountry?countryName=${countryName}`
    );
  }

  /**
   * Get a list of cities by state name.
   * @param stateName - The name of the state to get cities for.
   * @returns Observable of an array of country objects (cities).
   */
  getCityByState(stateName: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}Country/getcitybystate?state=${stateName}`
    );
  }
}
