import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { taskAdd } from '../models/taskAdd.model';
import { Task } from '../models/task.model';
import { taskAcknowledgeModel } from '../models/taskAcknowledge.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl + '/api/';

  constructor(private http: HttpClient) {}

  // Get all tasks by sequence ID
  getTasks(sequenceId: number): Observable<Task[]> {
    return this.http.post<Task[]>(
      `${this.apiUrl}Task/getallbysequenceId?sequenceId=${sequenceId}`,
      sequenceId
    );
  }

  // Get task by ID
  getTask(taskId: number): Observable<Task> {
    return this.http.post<Task>(
      `${this.apiUrl}Task/getbyid?Id=${taskId}`,
      taskId
    );
  }

  // Add new task
  addTask(task: taskAdd): Observable<Task[]> {
    const formData = new FormData();

    formData.append('SequenceId', task.sequenceId.toString());
    formData.append('TaskTitle', task.taskTitle);
    formData.append('TaskDescription', task.taskDescription);
    formData.append('PrimaryTeamMember', task.primaryTeamMember.toString());
    formData.append('BackupTeamMember', task.backupTeamMember.toString());
    formData.append('TaskEstimates', task.taskEstimates);
    formData.append('CreatedBy', task.createdBy.toString());
    formData.append('LastChangedBy', task.lastChangedBy.toString());
    if (task.file) {
      formData.append('File', task.file);
    }
    if (task.id) {
      formData.append('Id', task.id.toString());
    }
    return this.http.post<string>(`${this.apiUrl}Task/add`, formData).pipe(
      switchMap(() => {
        return this.getTasks(task.sequenceId).pipe(
          map((sequences) => {
            return sequences;
          })
        );
      })
    );
  }

  // Edit an existing task
  editTask(task: taskAdd): Observable<Task[]> {
    const formData = new FormData();
    formData.append('SequenceId', task.sequenceId.toString());
    formData.append('TaskTitle', task.taskTitle);
    formData.append('TaskDescription', task.taskDescription);
    formData.append('PrimaryTeamMember', task.primaryTeamMember.toString());
    formData.append('BackupTeamMember', task.backupTeamMember.toString());
    formData.append('TaskEstimates', task.taskEstimates);
    formData.append('CreatedBy', task.createdBy.toString());
    formData.append('LastChangedBy', task.lastChangedBy.toString());

    if (task.file) {
      formData.append('File', task.file);
      formData.append('filePath', task.filePath || '');
    }
    if (task.isAttachmentRemoved) {
      formData.append('FilePath', task.filePath || '');
      formData.append('IsAttachmentRemoved', task.isAttachmentRemoved.toString());
    }

    if (task.id) {
      formData.append('Id', task.id.toString());
    }

    return this.http.put<string>(`${this.apiUrl}Task/update`, formData).pipe(
      switchMap(() => {
        return this.getTasks(task.sequenceId).pipe(
          map((sequences) => {
            return sequences;
          })
        );
      })
    );
  }

  // Delete task by ID
  deleteTask(taskId: number, sequenceId: number): Observable<Task[]> {
    return this.http
      .delete<string>(`${this.apiUrl}Task/delete?id=${taskId}`)
      .pipe(
        switchMap(() => {
          return this.getTasks(sequenceId).pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }

  // Acknowledge the task (Test Process & Execution Process)
  acknowledgeTask(newTask: taskAcknowledgeModel): Observable<Task> {
    return this.http
      .post<string>(`${this.apiUrl}Task/taskAcknowledge`, newTask)
      .pipe(
        switchMap(() => {
          return this.getTask(newTask.taskId).pipe(
            map((sequences) => {
              return sequences;
            })
          );
        })
      );
  }

  // Marks a task as completed by updating its status.
  // Task completion (Test Process & Execution Process)
  taskCompletion(
    id: number,
    lastChangedBy: number,
    status: string
  ): Observable<Task> {
    return this.http
      .put<Task>(`${this.apiUrl}Task/updatestatus`, {
        id,
        status,
        lastChangedBy,
      })
      .pipe(
        switchMap(() => {
          return this.getTask(id).pipe(
            map((task) => {
              return task;
            })
          );
        })
      );
  }
  //Reports a problem with a task (optional file attachment).
  // Task problem report (Test Process & Execution Process)
  taskProblemReporting(
    taskId: number,
    lastChangedBy: number,
    message: string,
    file?: File
  ): Observable<Task> {
    const formData = new FormData();
    formData.append('TaskId', taskId.toString());
    formData.append('LastChangedBy', lastChangedBy.toString());
    formData.append('Message', message);
    if (file) {
      formData.append('File', file);
    }

    return this.http
      .post<Task>(`${this.apiUrl}Task/task-problem-reporting`, formData)
      .pipe(
        switchMap(() => {
          return this.getTask(taskId).pipe(map((task) => task));
        })
      );
  }

  // Resolves a reported problem with a task (optional file attachment).
  // Resolve task problem (Test Process & Execution Process)
  resolveTaskProblem(
    id: number,
    taskId: number,
    message: string,
    lastChangedBy: number,
    sequenceId: number,
    file?: File
  ): Observable<Task[]> {
    if (taskId === null || taskId === 0) {
      throw new Error('taskId is required but is undefined or null');
    }

    if (!message) {
      throw new Error('message is required but is undefined or empty');
    }

    if (lastChangedBy === null) {
      throw new Error('lastChangedBy is required but is undefined or null');
    }

    if (sequenceId === null) {
      throw new Error('sequenceId is required but is undefined or null');
    }

    const formData = new FormData();
    formData.append('Id', id.toString());
    formData.append('TaskId', taskId.toString());
    formData.append('Message', message);
    formData.append('LastChangedBy', lastChangedBy.toString());

    if (file) {
      formData.append('File', file);
    }

    return this.http
      .post<Task[]>(`${this.apiUrl}Task/task-problem-resolve`, formData)
      .pipe(
        switchMap(() => {
          return this.getTasks(sequenceId).pipe(map((tasks) => tasks));
        })
      );
  }

  // Fetches details of a reported task problem.
  // Get task problem details reported & resolved (Test Process & Execution Process)
  getTaskProblemDetails(taskId: number): Observable<Task> {
    const url = `${this.apiUrl}Task/task-problem-detail/${taskId}`;
    return this.http.get<Task>(url);
  }

  // Fetches task metrics for displaying graphs
  getTaskCapturingMetrices(
    planId: number,
    sequenceId: number
  ): Observable<
    {
      taskIdentifier: string;
      diffETaCT: number;
      diffETaAT: number;
      taskTitle: string;
    }[]
  > {
    const url = `${this.apiUrl}Task/gettaskmetricsbyplanId?brPlanId=${planId}&sequenceId=${sequenceId}`;
    return this.http.post<
      {
        taskIdentifier: string;
        diffETaCT: number;
        diffETaAT: number;
        taskTitle: string;
      }[]
    >(url, planId);
  }
}
