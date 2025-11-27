export interface brPlanReport {
  id: number;
  planStatus: string;
  planName: string;
  sequenceBuildStarted: number;
  sequenceBuildCompleted: number;
  sequenceTestInProgress: number;
  sequenceTested: number;
  sequenceExecutionInProgress: number;
  sequenceExecuted: number;
  sequenceTestAborted: number;
  totalTasks: number;
  totalSequences: number;
}
