export enum PhaseEnum {
  PRE = 0,
  POST = 1,
  SRA = 2,
  RADIOTERAPIA = 3,
  TRATAMIENTO_SISTEMICO = 4,
  LINFEDEMA = 5,
}

export const PHASE_LABELS: Record<PhaseEnum, string> = {
  [PhaseEnum.PRE]: "Pre Cirugía",
  [PhaseEnum.POST]: "Post Cirugía",
  [PhaseEnum.SRA]: "SRA",
  [PhaseEnum.RADIOTERAPIA]: "Radioterapia",
  [PhaseEnum.TRATAMIENTO_SISTEMICO]: "Tratamiento sistemico",
  [PhaseEnum.LINFEDEMA]: "Linfedema",
};

export const PHASE_OPTIONS = (
  Object.values(PhaseEnum).filter(
    (value): value is PhaseEnum => typeof value === "number",
  ) as PhaseEnum[]
).map((value) => ({
  value,
  label: PHASE_LABELS[value],
}));
