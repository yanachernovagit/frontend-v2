export type ProfileQuestion = {
  id: string;
  title: string;
  type: "multiple" | "date" | "open" | "number";
  options: string[];
  isActive: boolean;
  isRequired: boolean;
  order: number;
  step: number;
  dependsOnQuestionId: string | null;
  dependsOnValue: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProfileQuestionAnswer = {
  userId: string;
  questionId: string;
  answer: string;
};
