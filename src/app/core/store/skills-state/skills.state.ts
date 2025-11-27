import { drSkill } from '../../models/drSkill.model';

export interface SkillsState {
  skills: drSkill[];
  skill: drSkill;
  error: string;
  message: string;
  loading: boolean;
}

export const initialSkillsState: SkillsState = {
  skills: [],
  error: '',
  message: '',
  loading: false,
  skill: {
    id: 0,
    drTeamId: 0,
    createdBy: 0,
    skillName: '',
    status: false,
    isDeleted: false,
    createdDate: new Date(),
    lastChangedBy: 0,
    lastChangedDate: new Date(),
    drTeamName: '',
  },
};
