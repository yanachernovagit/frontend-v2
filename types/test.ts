import { FC } from "react";

export type TestItemDto = {
  icon: FC<{ className?: string }>;
  title: string;
  description: string;
  type: "measurement" | "time";
  duration?: string;
  status: "pending" | "completed";
  onPress?: () => void;
};
