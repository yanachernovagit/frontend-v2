import { ValidRoutes } from "./valid-routes";

export type Task = {
  title: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
  linkTo?: ValidRoutes;
  visible?: boolean;
};
