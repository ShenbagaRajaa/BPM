import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, mergeMap } from 'rxjs/operators';
import { showSnackBar } from '../snackbar-state/snackbar.action';
import {
  getSequence,
  getSequenceSuccess,
  getSequenceFailure,
  getSequences,
  getSequencesFailure,
  getSequencesSuccess,
  addSequence,
  addSequenceFailure,
  addSequenceSuccess,
  editSequence,
  editSequenceFailure,
  editSequenceSuccess,
  deleteSequence,
  deleteSequenceSuccess,
  deleteSequenceFailure,
  dispatchSequence,
  executeSequence,
  executeSequenceFailure,
  executeSequenceSuccess,
  dispatchSequenceSuccess,
  dispatchSequenceFailure,
} from './sequence.action';
import { SequenceService } from '../../services/sequence.service';

@Injectable()
export class SequenceEffects {
  private actions$ = inject(Actions);
  private service = inject(SequenceService);

  getSequences$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getSequences),
      exhaustMap((action) =>
        this.service.getSequences(action.planId).pipe(
          mergeMap((sequences) => from([getSequencesSuccess({ sequences })])),
          catchError((error) =>
            from([getSequencesFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getSequence$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getSequence),
      exhaustMap((action) =>
        this.service.getSequenceByPlanId(action.sequenceId).pipe(
          mergeMap((sequence) => from([getSequenceSuccess({ sequence })])),
          catchError((error) =>
            from([getSequenceFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  addSequence$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addSequence),
      mergeMap((action) =>
        this.service.addSequence(action.addSequence).pipe(
          mergeMap((sequences) => {
            return from([
              showSnackBar({
                message: 'Sequence added successfully',
                status: 'success',
              }),
              addSequenceSuccess({ sequences }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addSequenceFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([addSequenceFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  editSequence$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editSequence),
      mergeMap((action) =>
        this.service.editSequence(action.editSequence, action.planId).pipe(
          mergeMap((sequences) => {
            const { status, id: sequenceId } = action.editSequence;

            const commonActions = [
              getSequence({ sequenceId }),
              editSequenceSuccess({ sequences }),
            ];

            let snackBarMessage: string;

            if (status === 'SequenceTestInProgress') {
              snackBarMessage = 'Sequence Test In Progress';
            } else if (status === 'SequenceBuildCompleted') {
              snackBarMessage = 'Sequence completed successfully.';
            } else {
              snackBarMessage = 'Sequence Updated successfully';
            }

            return from([
              showSnackBar({
                message: snackBarMessage,
                status: 'success',
              }),
              ...commonActions,
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                editSequenceFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([editSequenceFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  deleteSequence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteSequence),

      mergeMap((action) =>
        this.service.deleteSequence(action.sequenceId, action.planId).pipe(
          mergeMap((sequences) => {
            return from([
              showSnackBar({
                message: 'Sequence Deleted Successfully', // Use the plain text response directly
                status: 'success',
              }),
              deleteSequenceSuccess({ sequences }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                deleteSequenceFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              deleteSequenceFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    )
  );

  dispactchSequence$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(dispatchSequence),
      mergeMap((action) =>
        this.service
          .dispatchSequence(
            action.sequenceId,
            action.lastChangedBy,
            action.planId
          )
          .pipe(
            mergeMap((sequences) => {
              return from([
                showSnackBar({
                  message: 'Sequence Testing Started Successfully',
                  status: 'success',
                }),
                dispatchSequenceSuccess({ sequences }),
              ]);
            }),
            catchError((error) => {
              if (error?.error?.detail !== 'Authorization Failed.') {
                return from([
                  dispatchSequenceFailure({ error: error?.error?.detail }),
                  showSnackBar({
                    message: error?.error?.detail,
                    status: 'error',
                  }),
                ]);
              }
              return from([
                dispatchSequenceFailure({ error: error?.error?.detail }),
              ]);
            })
          )
      )
    );
  });

  executeSequence$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(executeSequence),
      mergeMap((action) =>
        this.service.executePlan(action.PlanId, action.lastChangedBy).pipe(
          mergeMap((sequences) => {
            return from([
              showSnackBar({
                message: action.successMessage,
                status: 'success',
              }),
              executeSequenceSuccess({ sequences }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                executeSequenceFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([
              executeSequenceFailure({ error: error?.error?.detail }),
            ]);
          })
        )
      )
    );
  });
}
