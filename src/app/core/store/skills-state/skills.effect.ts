import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, mergeMap, tap } from 'rxjs/operators';
import {
  addSkill,
  addSkillFailure,
  addSkillSuccess,
  deleteSkill,
  deleteSkillFailure,
  deleteSkillSuccess,
  editSkill,
  editSkillFailure,
  editSkillSuccess,
  getSkill,
  getSkillFailure,
  getSkillSuccess,
  getSkills,
  getSkillsFailure,
  getSkillsSuccess,
} from './skills.action';
import { SkillsService } from '../../services/skills.service';
import { Router } from '@angular/router';
import { showSnackBar } from '../snackbar-state/snackbar.action';

@Injectable()
export class SkillsEffects {
  private actions$ = inject(Actions);
  private service = inject(SkillsService);
  private router = inject(Router);

  getSkills$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getSkills),
      exhaustMap(() =>
        this.service.getSkills().pipe(
          mergeMap((skills) => from([getSkillsSuccess({ skills })])),
          catchError((error) =>
            from([getSkillsFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getSkill$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getSkill),
      exhaustMap((action) =>
        this.service.getSkill(action.skillId).pipe(
          mergeMap((skill) => from([getSkillSuccess({ skill })])),
          catchError((error) =>
            from([getSkillFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  addSkill$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addSkill),
      mergeMap((action) =>
        this.service.addSkill(action.newSkill).pipe(
          mergeMap((skills) =>
            from([
              showSnackBar({
                message: 'DR Skill added successfully',
                status: 'success',
              }),
              addSkillSuccess({ skills }),
            ])
          ),
          tap(() => {
            this.router.navigate([`../home/skillManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addSkillFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([addSkillFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  editSkill$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editSkill),
      mergeMap((action) =>
        this.service.editSkill(action.updatedSkill).pipe(
          mergeMap((skills) =>
            from([
              showSnackBar({
                message: 'DR Skill updated successfully',
                status: 'success',
              }),
              editSkillSuccess({ skills }),
            ])
          ),
          tap(() => {
            this.router.navigate([`../home/skillManagement/`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                editSkillFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([editSkillFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  deleteSkill$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteSkill),
      mergeMap((action) =>
        this.service.deleteSkill(action.skillId, action.userId).pipe(
          mergeMap((skills) =>
            from([
              showSnackBar({
                message: 'DR Skill deleted successfully',
                status: 'success',
              }),
              deleteSkillSuccess({
                skills,
                skillId: action.skillId, // Pass the skillId from the action
              }),
            ])
          ),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                deleteSkillFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([deleteSkillFailure({ error: error?.error?.detail })]);
          })
        )
      )
    )
  );
}
