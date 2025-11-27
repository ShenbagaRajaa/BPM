interface PlanStatusCount {
  status: string;
  count: number;
}

interface SequenceStatusCount {
  status: string;
  count: number;
  taskWithStatus: TaskStatusCount[];
}

interface TaskStatusCount {
  status: string;
  count: number;
}

interface TaskMetricData {
  [status: string]: string; // e.g., { InTestDispatched: '2025-04-01T01:00:00.000Z' }
}

interface TaskMetric {
  name: string;
  data: TaskMetricData[];
}

interface Task {
  taskId: number;
  taskTitle: string;
  status: string;
  taskMetrices?: TaskMetric[];
}

interface Sequence {
  sequenceId: number;
  sequenceName: string;
  InBuildNew: number;
  InTestDispatched: number;
  InTestAcknowledged: number;
  InTestCompleted: number;
  InTestProblem: number;
  InTestProblemResolved: number;
  InTestTaskTestFailed: number;
  InExecuteDispatched: number;
  InExecuteAcknowledged: number;
  InExecuteCompleted: number;
  InExecuteProblem: number;
  InExecuteProblemResolved: number;
  taskData?: Task[];
}

export interface DashBoardPlan {
  planId: number;
  planName: string;
  sequences: Sequence[];
}

export interface PlanData {
  plan: DashBoardPlan
}

export interface ApiResponse {
  planId: number;
  planWithStatus: PlanStatusCount[];
  sequenceWithStatus: SequenceStatusCount[];
  taskWithStatus: TaskStatusCount[];
}
