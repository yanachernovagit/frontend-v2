export interface NotificationTemplate {
  id: string;
  type: string;
  title: string;
  body: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationLog {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  sentAt: string;
  status: "sent" | "failed" | "partial";
}

export interface NotificationStats {
  sentToday: number;
  totalSent: number;
  byType: Record<string, number>;
}
