import { inject, Inject, Injectable, Optional } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, mergeMap, tap } from 'rxjs/operators';
import { showSnackBar } from '../snackbar-state/snackbar.action';
import { SiteService } from '../../services/site.service';
import {
  getSites,
  getSitesSuccess,
  getSitesFailure,
  getSite,
  getSiteSuccess,
  getSiteFailure,
  addSite,
  addSiteSuccess,
  addSiteFailure,
  editSite,
  editSiteSuccess,
  editSiteFailure,
  deleteSite,
  deleteSiteSuccess,
  deleteSiteFailure,
} from './site.action';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Injectable()
export class SiteEffects {
  private actions$ = inject(Actions);
  private service = inject(SiteService);
  private router = inject(Router);
  @Optional()
  @Inject(MAT_DIALOG_DATA)
  public data: { modelId: number } | null = null;

  getSites$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getSites),
      exhaustMap(() =>
        this.service.getSites().pipe(
          mergeMap((sites) => {
            return from([getSitesSuccess({ sites })]);
          }),
          catchError((error) =>
            from([getSitesFailure({ error: error?.error?.detail })])
          )
        )
      )
    );
  });

  getSite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getSite),
      exhaustMap((action) =>
        this.service.getSite(action.siteId).pipe(
          mergeMap((site) => from([getSiteSuccess({ site })])),
          catchError((error) => {
            return from([getSiteFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  addSite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addSite),
      mergeMap((action) =>
        this.service.addSite(action.addSite).pipe(
          mergeMap((sites) => {
            return from([
              showSnackBar({
                message: 'Site added successfully',
                status: 'success',
              }),
              addSiteSuccess({ sites }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                addSiteFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([addSiteFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  editSite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editSite),
      mergeMap((action) =>
        this.service.editSite(action.editSite).pipe(
          mergeMap((sites) => {
            return from([
              showSnackBar({
                message: 'Site updated successfully',
                status: 'success',
              }),
              editSiteSuccess({ sites }),
            ]);
          }),
          tap(() => {
            this.router.navigate([`../home/siteManagement/listOfSites`]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                editSiteFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([editSiteFailure({ error: error?.error?.detail })]);
          })
        )
      )
    );
  });

  deleteSite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteSite),

      mergeMap((action) =>
        this.service.deleteSite(action.siteId, action.userId).pipe(
          mergeMap((sites) => {
            return from([
              showSnackBar({
                message: 'Site Deleted Successfully',
                status: 'success',
              }),
              deleteSiteSuccess({ sites }),
            ]);
          }),
          catchError((error) => {
            if (error?.error?.detail !== 'Authorization Failed.') {
              return from([
                deleteSiteFailure({ error: error?.error?.detail }),
                showSnackBar({
                  message: error?.error?.detail,
                  status: 'error',
                }),
              ]);
            }
            return from([deleteSiteFailure({ error: error?.error?.detail })]);
          })
        )
      )
    )
  );
}
