import { drTeam } from '../../models/drTeam.model';

export interface drTeamState {
  drTeams: drTeam[];
  drTeam: drTeam;
  error: string;
  message: string;
}

export const initialState: drTeamState = {
  drTeams: [],
  error: '',
  message: '',
  drTeam: {
    id: 0,
    teamName: '',
    status: true,
    createdBy: 0,
    lastChangedBy: 0,
  },
};
