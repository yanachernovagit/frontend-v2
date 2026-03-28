type StsPercentiles = {
  p25: number;
  p75: number;
};

type StsAgeRange = {
  minAge: number;
  maxAge: number;
  p25: number;
  p75: number;
};

type StsMessages = {
  above?: string;
  below?: string;
  within?: string;
};

const DEFAULT_STS_MESSAGES: Required<StsMessages> = {
  below:
    "Tu resultado está por debajo de lo esperado para tu edad. Se recomienda iniciar entrenamiento de fuerza y resistencia de extremidades inferiores ¡Comencemos!",
  above: "Tu resultado está sobre lo esperado para tu edad. ¡Continúa así!",
  within:
    "Tu resultado está dentro de lo esperado para tu edad. ¡Buen trabajo! Mantén tu nivel de actividad física.",
};

export function getAgeFromBirthDate(birthDate: string): number {
  const normalized = birthDate.trim();
  const ddmmyyyy = normalized.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  const birth = ddmmyyyy
    ? new Date(
        Number(ddmmyyyy[3]),
        Number(ddmmyyyy[2]) - 1,
        Number(ddmmyyyy[1]),
      )
    : new Date(normalized);
  if (Number.isNaN(birth.getTime())) return NaN;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age--;
  return age;
}

export function getStsFeedback(
  repetitions: number,
  age: number,
  options?: {
    ageRanges?: StsAgeRange[] | null;
    stsMessages?: StsMessages | null;
  },
): { message: string; level: "below" | "within" | "above" } | null {
  const ageRanges = options?.ageRanges ?? [];
  if (!Array.isArray(ageRanges) || ageRanges.length === 0) return null;

  const row = ageRanges.find((r) => age >= r.minAge && age <= r.maxAge);
  if (!row) return null;

  const { p25, p75 } = row;
  const messages = {
    ...DEFAULT_STS_MESSAGES,
    ...(options?.stsMessages ?? {}),
  };

  if (repetitions <= p25) {
    return {
      level: "below",
      message: messages.below,
    };
  }
  if (repetitions >= p75) {
    return {
      level: "above",
      message: messages.above,
    };
  }
  return {
    level: "within",
    message: messages.within,
  };
}
