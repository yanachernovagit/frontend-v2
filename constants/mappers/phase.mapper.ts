import { PhaseEnum } from "@/constants/enums";

export const phaseToTitleMap: Record<PhaseEnum, string> = {
  [PhaseEnum.PRE]: "Mi plan Pre - Cirugía",
  [PhaseEnum.POST]: "Mi plan Post - Cirugía",
};

export const getPhaseTitle = (phase?: PhaseEnum): string => {
  if (phase === undefined || phase === null) {
    return phaseToTitleMap[PhaseEnum.PRE];
  }
  return phaseToTitleMap[phase] || phaseToTitleMap[PhaseEnum.PRE];
};
