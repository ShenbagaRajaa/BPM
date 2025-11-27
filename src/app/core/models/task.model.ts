
  export interface Task {
    id: number;
    planIdentifier: string;
    sequenceId : string;
    taskIdentifier: string;
    taskTitle: string;
    taskDescription : string
    status: string;
    primaryTeamMember: number;
    backupTeamMember: number;
    taskEstimates: string; 
    createdBy : number;
    filePath?: string;
    fileName?: string;
    actualResponseTimeinMins: string; 
    actualTimetoCompletioninMins: string; 
    acknowledgedBy: string;
    acknowledgedDate: string; 
    completedBy: string;
    completedDate: string; 
    reportedProblemBy: string;
    problemReportedDate: string; 
    planStatus?: string;
    sequenceStatus?: string;
}
