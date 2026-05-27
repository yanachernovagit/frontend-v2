export enum StageEnum {
  ADV0 = 0,
  ADV1 = 1,
  ADV2 = 2,
  ADV3 = 3,
}

export const STAGE_LABELS: Record<StageEnum, string> = {
  [StageEnum.ADV0]: "Etapa 0",
  [StageEnum.ADV1]: "Etapa 1",
  [StageEnum.ADV2]: "Etapa 2",
  [StageEnum.ADV3]: "Etapa 3",
};

export const STAGE_OPTIONS = (
  Object.values(StageEnum).filter(
    (value): value is StageEnum => typeof value === "number",
  ) as StageEnum[]
).map((value) => ({
  value,
  label: STAGE_LABELS[value],
}));
