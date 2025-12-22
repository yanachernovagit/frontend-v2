import { FC } from "react";
import { SvgProps } from "react-native-svg";

export type TestItemDto = {
  icon: FC<SvgProps>;
  title: string;
  description: string;
  type: "measurement" | "time";
  duration?: string;
  status: "pending" | "completed";
  onPress?: () => void;
};
