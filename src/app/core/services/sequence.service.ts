import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { Sequence } from '../models/Sequence.model';
import { environment } from '../../../environment/environment';
import { sequenceAdd } from '../models/sequenceAdd.model';
import { sequenceUpdate } from '../models/sequenceUpdate.model';

@Injectable({
  providedIn: 'root',
})
export class SequenceService {
  private apiUrl = environment.apiUrl + '/api/';

  constructor(private http: HttpClient) {}

  // Get all sequences
  getSequences(planId: number): Observable<Sequence[]> {
    return this.http.post<Sequence[]>(
      `${this.apiUrl}Sequence/getbybrplanid?brPlanId=${planId}`,
      planId
    );
  }

  // Get sequence by ID
  getSequenceByPlanId(sequenceId: number): Observable<Sequence> {
    return this.http.post<Sequence>(
      `${this.apiUrl}Sequence/getbyid?Id=${sequenceId}`,
      sequenceId
    );
  }

  // Add new sequence
  addSequence(newSequence: sequenceAdd): Observable<Sequence[]> {
    return this.http
      .post<string>(`${this.apiUrl}Sequence/add`, newSequence)
      .pipe(
        switchMap(() => {
          return this.getSequences(newSequence.brPlanId).pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }

  // Edit an existing sequence
  editSequence(
    sequence: sequenceUpdate,
    planId: number
  ): Observable<Sequence[]> {
    return this.http
      .put<string>(`${this.apiUrl}Sequence/update`, sequence)
      .pipe(
        switchMap(() => {
          return this.getSequences(planId).pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }

  // Delete sequence by ID
  deleteSequence(sequenceId: number, planId: number): Observable<Sequence[]> {
    return this.http
      .delete(`${this.apiUrl}Sequence/delete?id=${sequenceId}`, {
        responseType: 'text',
      })
      .pipe(
        switchMap(() => {
          return this.getSequences(planId).pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }

  // Start a test process
  dispatchSequence(
    sequenceId: number,
    lastChangedBy: number,
    planId: number
  ): Observable<Sequence[]> {
    return this.http
      .post<string>(`${this.apiUrl}Sequence/dispatchSequence`, {
        sequenceId,
        lastChangedBy,
      })
      .pipe(
        switchMap(() => {
          return this.getSequences(planId).pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }

  // Start a execution process
  executeSequence(
    sequenceId: number,
    lastChangedBy: number,
    planId: number
  ): Observable<Sequence[]> {
    return this.http
      .post<string>(`${this.apiUrl}Sequence/executeSequence`, {
        sequenceId,
        lastChangedBy,
      })
      .pipe(
        switchMap(() => {
          return this.getSequences(planId).pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }

  executePlan(planId: number, lastChangedBy: number): Observable<Sequence[]> {
    return this.http
      .post<void>(`${this.apiUrl}BRPlan/executebrplan`, {
        planId,
        lastChangedBy,
      })
      .pipe(
        switchMap(() => {
          return this.getSequences(planId).pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }
}
