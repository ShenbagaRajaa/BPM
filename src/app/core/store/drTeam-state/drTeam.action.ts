import { createAction, props } from '@ngrx/store';
import { drTeam } from '../../models/drTeam.model';

export const getDRTeams = createAction('[DRTeams] Get DRTeams');

export const getDRTeamsSuccess = createAction(
  '[DRTeam] Get DRTeams Success',
  props<{ drTeams: drTeam[] }>()
);

export const getDRTeamsFailure = createAction(
  '[DRTeam] Get DRTeams Failure',
  props<{ error: string }>()
);

export const getDRTeam = createAction(
  '[DRTeam] Get drTeam',
  props<{ drTeamId: number }>()
);

export const getDRTeamSuccess = createAction(
  '[DRTeam] Get DRTeam Success',
  props<{ drTeam: drTeam }>()
);

export const getDRTeamFailure = createAction(
  '[DRTeam] Get DRTeam Failure',
  props<{ error: string }>()
);

export const addDRTeam = createAction(
  '[DRTeam] Add DRTeam',
  props<{ addDRTeam: drTeam }>()
);

export const addDRTeamSuccess = createAction(
  '[DRTeam] Add DRTeam Success',
  props<{ message: string }>()
);

export const addDRTeamFailure = createAction(
  '[DRTeam] Add DRTeam Failure',
  props<{ error: string }>()
);

export const editDRTeam = createAction(
  '[DRTeam] Edit DRTeam',
  props<{ editDRTeam: drTeam }>()
);

export const editDRTeamSuccess = createAction(
  '[DRTeam] Edit DRTeam Success',
  props<{ message: string }>()
);

export const editDRTeamFailure = createAction(
  '[DRTeam] Edit DRTeam Failure',
  props<{ error: string }>()
);

export const deleteDRTeam = createAction(
  '[DRTeam] Delete DRTeam',
  props<{ drTeamId: number; userId: number }>()
);

export const deleteDRTeamSuccess = createAction(
  '[DRTeam] Delete DRTeam Success',
  props<{ message: string }>()
);

export const deleteDRTeamFailure = createAction(
  '[DRTeam] Delete DRTeam Failure',
  props<{ error: string }>()
);
