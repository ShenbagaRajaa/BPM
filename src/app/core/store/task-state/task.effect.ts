import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { showSnackBar } from '../snackbar-state/snackbar.action';
import { TaskService } from '../../services/task.service';
import {
  getTasks,
  getTasksSuccess,
  getTasksFailure,
  getTask,
  getTaskSuccess,
  getTaskFailure,
  addTask,
  addTaskFailure,
  addTaskSuccess,
  editTask,
  editTaskFailure,
  editTaskSuccess,
  deleteTask,
  deleteTaskSuccess,
  deleteTaskFailure,
  taskAcknowledges,
  taskAcknowledgeFailure,
  taskAcknowledgeSuccess,
  taskProblemReporting,
  taskCompletion,
  taskCompletionFailure,
  taskCompletionSuccess,
  resolveTaskProblem,
  resolveTaskProblemFailure,
  resolveTaskProblemSuccess,
  getTaskProblemDetail,
  getTaskProblemDetailFailure,
  getTaskProblemDetailSuccess,
  taskProblemReportingSuccess,
  taskProblemReportingFailure,
} from './task.action';

@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private service = inject(TaskService);

  getTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getTasks),
      exhaustMap((action) =>
        this.service.getTasks(action.sequenceId).pipe(
          mergeMap((tasks) => from([getTasksSuccess({ tasks })])),
          catchError((error) =>
            from([getTasksFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getTask$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getTask),
      exhaustMap((action) =>
        this.service.getTask(action.taskId).pipe(
          mergeMap((task) => from([getTaskSuccess({ task })])),
          catchError((error) => {
            return from([getTaskFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  addTask$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addTask),
      mergeMap((action) =>
        this.service.addTask(action.addTask).pipe(
          mergeMap((tasks) => {
            return from([
              showSnackBar({
                message: 'Task added successfully',
                status: 'success',
              }),
              addTaskSuccess({ tasks }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addTaskFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([addTaskFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  editTask$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editTask),
      mergeMap((action) =>
        this.service.editTask(action.editTask).pipe(
          mergeMap((tasks) => {
            return from([
              showSnackBar({
                message: 'Task updated successfully',
                status: 'success',
              }),
              editTaskSuccess({ tasks }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                editTaskFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([editTaskFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTask),

      mergeMap((action) =>
        this.service.deleteTask(action.taskId, action.sequenceId).pipe(
          mergeMap((tasks) => {
            return from([
              showSnackBar({
                message: 'Task Deleted Successfully',
                status: 'success',
              }),
              deleteTaskSuccess({ tasks }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                deleteTaskFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([deleteTaskFailure({ error: error?.error?.detail })]);
          })
        )
      )
    )
  );

  taskAcknowledge$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(taskAcknowledges),
      mergeMap((action) =>
        this.service.acknowledgeTask(action.taskAck).pipe(
          mergeMap((task) => {
            return from([
              showSnackBar({
                message: 'Task Acknowledged successfully',
                status: 'success',
              }),
              taskAcknowledgeSuccess({ task }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                taskAcknowledgeFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              taskAcknowledgeFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    );
  });

  taskProblemReporting$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(taskProblemReporting),
      mergeMap((action) =>
        this.service
          .taskProblemReporting(
            action.taskId,
            action.lastChangedBy,
            action.message,
            action.file
          )
          .pipe(
            mergeMap((task) => {
              return from([
                showSnackBar({
                  message:
                    'You will be notified through Email and Message when there is a solution',
                  status: 'success',
                }),
                taskProblemReportingSuccess({ task }),
              ]);
            }),
            catchError((error) => {
              if (error?.error?.detail !== 'Authorization Failed.') {
                return from([
                  taskProblemReportingFailure({ error: error?.error?.detail }),
                  showSnackBar({
                    message: error?.error?.detail,
                    status: 'error',
                  }),
                ]);
              }
              return from([
                taskProblemReportingFailure({ error: error?.error?.detail }),
              ]);
            })
          )
      )
    );
  });

  taskCompletion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(taskCompletion),
      mergeMap((action) =>
        this.service
          .taskCompletion(action.taskId, action.lastChangedBy, action.status)
          .pipe(
            mergeMap((task) => {
              return from([
                showSnackBar({
                  message: 'Task Completion Successfully',
                  status: 'success',
                }),
                taskCompletionSuccess({ task }),
              ]);
            }),
            catchError((error) => {
              if (error?.error?.detail !== 'Authorization Failed.') {
                return from([
                  taskCompletionFailure({ error: error?.error?.detail }),
                  showSnackBar({
                    message: error?.error?.detail,
                    status: 'error',
                  }),
                ]);
              }
              return from([
                taskCompletionFailure({ error: error?.error?.detail }),
              ]);
            })
          )
      )
    );
  });

  resolveTaskProblem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(resolveTaskProblem),
      mergeMap((action) =>
        this.service
          .resolveTaskProblem(
            action.id,
            action.taskId,
            action.message,
            action.lastChangedBy,
            action.sequenceId,
            action.file
          )
          .pipe(
            mergeMap((tasks) =>
              from([
                showSnackBar({
                  message: 'Problem resolved successfully',
                  status: 'success',
                }),
                resolveTaskProblemSuccess({ tasks }),
              ])
            ),
            catchError((error) => {
              if (error?.error?.detail !== 'Authorization Failed.') {
                return from([
                  resolveTaskProblemFailure({ error: error?.error?.detail }),
                  showSnackBar({
                    message: error?.error?.detail,
                    status: 'error',
                  }),
                ]);
              }
              return from([
                resolveTaskProblemFailure({ error: error?.error?.detail }),
              ]);
            })
          )
      )
    );
  });

  getTaskProblemDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTaskProblemDetail),
      mergeMap((action) =>
        this.service.getTaskProblemDetails(action.taskId).pipe(
          map((task) => getTaskProblemDetailSuccess({ task })),
          catchError((error) =>
            of(getTaskProblemDetailFailure({ error: error?.error?.detail }))
          )
        )
      )
    )
  );
}
