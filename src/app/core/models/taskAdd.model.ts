export interface taskAdd {
  sequenceId: number;
  taskTitle: string;
  taskDescription: string;
  primaryTeamMember: number;
  backupTeamMember: number;
  taskEstimates: string;
  createdBy: number;
  lastChangedBy: number;
  file?: File | null;
  id?: number;
  isAttachmentRemoved?: boolean;
  filePath?: string;
}
