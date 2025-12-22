export interface UserTasksStatus {
  id: string;
  userId: string;
  profileCompleted: boolean;
  firstEvaluationCompleted?: boolean;
  secondEvaluationCompleted?: boolean;
  dailyPlanCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
