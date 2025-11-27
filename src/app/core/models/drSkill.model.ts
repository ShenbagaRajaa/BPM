export interface drSkill {
  id: number;
  drTeamId: number;
  createdBy: number;
  skillName: string;
  status: boolean;
  isDeleted: boolean;
  createdDate: Date;
  lastChangedBy: number;
  lastChangedDate: Date;
  drTeamName?: string;
  description?: string;  
}
