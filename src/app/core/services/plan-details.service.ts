import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap, take } from 'rxjs';
import { plan } from '../models/plan.model';
import { planAdd } from '../models/planAdd.model';
import { Store } from '@ngrx/store';
import { appState } from '../store/app-state/app.state';
import { environment } from '../../../environment/environment';
import { selectUser } from '../store/auth-state/auth.selector';

@Injectable({
  providedIn: 'root',
})
export class PlanDetailsService {
  userId: number = 0;
  apiurl: string = environment.apiUrl + '/api/' + 'BRPlan/';

  constructor(private http: HttpClient, private store: Store<appState>) {
    this.getUserId();
  }

  // Get all plans
  getAllPlan(): Observable<plan[]> {
    return this.http.get<plan[]>(`${this.apiurl}getall`);
  }

  // Get a plan by ID
  getPlanById(id: number): Observable<plan> {
    return this.http.post<plan>(`${this.apiurl}getbyid?brPlanId=${id}`, id);
  }

  // Get plans by status
  getPlanByStatus(status: string): Observable<plan[]> {
    return this.http.post<plan[]>(
      `${this.apiurl}getbystatus?status=${status}`,
      status
    );
  }

  // Add a new plan
  addPlan(newPlan: planAdd): Observable<plan[]> {
    return this.http.post<number>(`${this.apiurl}add`, newPlan).pipe(
      switchMap(() => {
        return this.getAllPlan().pipe(
          map((plans) => {
            return plans;
          })
        );
      })
    );
  }

  // Edit an existing plan
  EditPlan(newPlan: planAdd): Observable<plan[]> {
    return this.http.put<number>(`${this.apiurl}update`, newPlan).pipe(
      switchMap(() => {
        return this.getAllPlan().pipe(
          map((plans) => {
            return plans;
          })
        );
      })
    );
  }

  // Delete a plan
  deletePlan(planId: number): Observable<plan[]> {
    return this.http
      .delete<void>(`${this.apiurl}delete?brPlanId=${planId}`)
      .pipe(
        switchMap(() => {
          return this.getAllPlan().pipe(
            map((plans) => {
              return plans;
            })
          );
        })
      );
  }

  // Get a report for BR Plan
  getBRPlanReport(): Observable<
    {
      id: number;
      planStatus: string;
      planName: string;
      sequenceBuildStarted: number;
      sequenceBuildCompleted: number;
      sequenceTestInProgress: number;
      sequenceTested: number;
      sequenceExecutionInProgress: number;
      sequenceExecuted: number;
      sequenceTestAborted: number;
      totalTasks: number;
      totalSequences: number;
    }[]
  > {
    return this.http.get<
      {
        id: number;
        planStatus: string;
        planName: string;
        sequenceBuildStarted: number;
        sequenceBuildCompleted: number;
        sequenceTestInProgress: number;
        sequenceTested: number;
        sequenceExecutionInProgress: number;
        sequenceExecuted: number;
        sequenceTestAborted: number;
        totalTasks: number;
        totalSequences: number;
      }[]
    >(`${this.apiurl}getbrplanreport`);
  }

  // Mark the status of a plan
  markPlanStatus(planId: number, newStatus: string): Observable<plan[]> {
    return this.store
      .select((state) => state.auth.user?.id)
      .pipe(
        take(1),
        switchMap((lastChangedBy) => {
          if (!lastChangedBy) {
            return of([]);
          }

          return this.http
            .put<void>(`${this.apiurl}updatestatus`, {
              id: planId,
              planStatus: newStatus,
              lastChangedBy: lastChangedBy,
            })
            .pipe(
              switchMap(() => this.getAllPlan()),
              map((plans) => plans)
            );
        })
      );
  }

  rebuildPlan(planId: number): Observable<void> {
    return this.http.put<void>(`${this.apiurl}rebuildplan`, {
      planId,
      lastChangedBy: this.userId,
    });
  }
  reExecutePlan(planId: number): Observable<void> {
    return this.http.put<void>(`${this.apiurl}reexecuteplan`, {
      planId,
      lastChangedBy: this.userId,
    });
  }

  reTestPlan(planId: number): Observable<void> {
    return this.http.put<void>(`${this.apiurl}retestplan`, {
      planId,
      lastChangedBy: this.userId,
    });
  }

  notifyAll(planId: number) {
    return this.http.post<void>(`${this.apiurl}notify?planId=${planId}`, {
      planId,
    });
  }

  getUserId() {
    this.store.select(selectUser).subscribe((data) => {
      this.userId = data.user.id;
    });
  }

  exportPlanExcel(planId: number): Observable<Blob> {
    return this.http.get(`${this.apiurl}exportplan`, {
      params: { planId: planId.toString(), userId: this.userId.toString() },
      responseType: 'blob', // important for file download
    });
  }

  importPlanExcel(planId: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', this.userId.toString());

    return this.http.post<void>(
      `${this.apiurl}importplan?planId=${planId}`,
      formData
    );
  }
}
