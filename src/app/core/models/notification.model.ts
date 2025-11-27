export interface Notification {
  id: number;
  userId: number;
  eventType: string;
  priority: string;
  linkURL: string;
  isRead: boolean;
  description: string;
  createdBy: number;
  lastChangedBy: number;
  createdDate: Date;
  lastChangedDate: Date;
}
