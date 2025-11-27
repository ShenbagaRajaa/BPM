import { createReducer, on } from '@ngrx/store';
import {
  getSkills,
  getSkillsSuccess,
  getSkillsFailure,
  addSkill,
  addSkillSuccess,
  addSkillFailure,
  deleteSkill,
  deleteSkillSuccess,
  deleteSkillFailure,
  editSkill,
  editSkillSuccess,
  editSkillFailure,
  getSkill,
  getSkillSuccess,
  getSkillFailure,
} from './skills.action';
import { initialSkillsState } from './skills.state';

export const SkillsReducer = createReducer(
  initialSkillsState,
  on(getSkills, (state) => ({
    ...state,
    loading: true,
  })),
  on(getSkillsSuccess, (state, { skills }) => ({
    ...state,
    loading: false,
    skills,
  })),
  on(getSkillsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(getSkill, (state) => ({
    ...state,
    loading: true,
  })),
  on(getSkillSuccess, (state, { skill }) => ({
    ...state,
    loading: false,
    skill,
  })),
  on(getSkillFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(addSkill, (state) => ({
    ...state,
    loading: true,
  })),
  on(addSkillSuccess, (state, { skills }) => ({
    ...state,
    loading: false,
    skills,
  })),
  on(addSkillFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(editSkill, (state) => ({
    ...state,
    loading: true,
  })),
  on(editSkillSuccess, (state, { skills }) => ({
    ...state,
    loading: false,
    skills,
  })),
  on(editSkillFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(deleteSkill, (state) => ({
    ...state,
    loading: true,
  })),

  on(deleteSkillSuccess, (state, { skills }) => ({
    ...state,
    loading: false,
    skills: skills,
  })),

  on(deleteSkillFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
