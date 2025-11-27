import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SkillsState } from './skills.state';

export const SKILLS_STATE_NAME = 'skills';

const getSkillsState = createFeatureSelector<SkillsState>(SKILLS_STATE_NAME);

export const selectAllSkills = createSelector(
  getSkillsState,
  (state) => state.skills
);
export const selectSkill = createSelector(
  getSkillsState,
  (state) => state.skill
);
export const selectSkillsError = createSelector(
  getSkillsState,
  (state) => state.error
);
export const selectSkillsMessage = createSelector(
  getSkillsState,
  (state) => state.message
);
