import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, mergeMap, tap } from 'rxjs/operators';
import { showSnackBar } from '../snackbar-state/snackbar.action';
import { Router } from '@angular/router';
import { DrteamService } from '../../services/drteam.service';
import {
  getDRTeams,
  getDRTeamsSuccess,
  getDRTeamsFailure,
  addDRTeam,
  addDRTeamFailure,
  addDRTeamSuccess,
  deleteDRTeam,
  deleteDRTeamFailure,
  deleteDRTeamSuccess,
  editDRTeam,
  editDRTeamFailure,
  editDRTeamSuccess,
  getDRTeam,
  getDRTeamFailure,
  getDRTeamSuccess,
} from './drTeam.action';

@Injectable()
export class drTeamEffects {
  private actions$ = inject(Actions);
  private service = inject(DrteamService);
  private router = inject(Router);
  getDRTeams$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getDRTeams),
      exhaustMap(() =>
        this.service.getDRTeams().pipe(
          mergeMap((drTeams) =>
            from([getDRTeamsSuccess({ drTeams: drTeams })])
          ),
          catchError((error) =>
            from([getDRTeamsFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getdrTeam$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getDRTeam),
      exhaustMap((action) =>
        this.service.getDRTeam(action.drTeamId).pipe(
          mergeMap((drTeam) => from([getDRTeamSuccess({ drTeam })])),
          catchError((error) => {
            return from([getDRTeamFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  adddrTeam$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addDRTeam),
      mergeMap((action) =>
        this.service.addDRTeam(action.addDRTeam).pipe(
          mergeMap((message) => {
            return from([
              showSnackBar({
                message: 'DR Team added successfully',
                status: 'success',
              }),
              addDRTeamSuccess({ message }),
            ]);
          }),
          tap(() => {
            this.router.navigate([`../home/drTeamManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addDRTeamFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([addDRTeamFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  editdrTeam$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editDRTeam),
      mergeMap((action) =>
        this.service.editDRTeam(action.editDRTeam).pipe(
          mergeMap((message) => {
            return from([
              showSnackBar({
                message: 'DR Team updated successfully',
                status: 'success',
              }),
              editDRTeamSuccess({ message }),
            ]);
          }),
          tap(() => {
            this.router.navigate([`../home/drTeamManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                editDRTeamFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([editDRTeamFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  deletedrTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteDRTeam),

      mergeMap((action) =>
        this.service.deleteDRTeam(action.drTeamId, action.userId).pipe(
          mergeMap((message) => {
            return from([
              showSnackBar({
                message: 'DR Team Deleted Successfully',
                status: 'success',
              }),
              deleteDRTeamSuccess({ message }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                deleteDRTeamFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([deleteDRTeamFailure({ error: error?.error?.detail })]);
          })
        )
      )
    )
  );
}
