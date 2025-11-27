import { createAction, props } from '@ngrx/store';
import { drSkill } from '../../models/drSkill.model';

export const getSkills = createAction('[Skills] Get Skills');

export const getSkillsSuccess = createAction(
  '[Skills] Get Skills Success',
  props<{ skills: drSkill[] }>()
);

export const getSkillsFailure = createAction(
  '[Skills] Get Skills Failure',
  props<{ error: string }>()
);

export const getSkill = createAction(
  '[Skills] Get Skill',
  props<{ skillId: number }>()
);

export const getSkillSuccess = createAction(
  '[Skills] Get Skill Success',
  props<{ skill: drSkill }>()
);

export const getSkillFailure = createAction(
  '[Skills] Get Skill Failure',
  props<{ error: string }>()
);

export const addSkill = createAction(
  '[Skills] Add Skill',
  props<{ newSkill: drSkill }>()
);

export const addSkillSuccess = createAction(
  '[Skills] Add Skill Success',
  props<{ skills: drSkill[] }>()
);

export const addSkillFailure = createAction(
  '[Skills] Add Skill Failure',
  props<{ error: string }>()
);

export const editSkill = createAction(
  '[Skills] Edit Skill',
  props<{ updatedSkill: drSkill }>()
);

export const editSkillSuccess = createAction(
  '[Skills] Edit Skill Success',
  props<{ skills: drSkill[] }>()
);

export const editSkillFailure = createAction(
  '[Skills] Edit Skill Failure',
  props<{ error: string }>()
);

export const deleteSkill = createAction(
  '[Skills] Delete Skill',
  props<{ skillId: number; userId: number }>()
);

export const deleteSkillSuccess = createAction(
  '[Skills] Delete Skill Success',
  props<{ skills: drSkill[]; skillId: number }>()
);

export const deleteSkillFailure = createAction(
  '[Skills] Delete Skill Failure',
  props<{ error: string }>()
);
