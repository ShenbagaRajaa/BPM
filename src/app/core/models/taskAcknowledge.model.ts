export interface taskAcknowledgeModel{
    taskId: number,
    lastChangedBy: number,
    isAcknowledged: boolean,
    eventTypeId: number,
    retries: number
  }