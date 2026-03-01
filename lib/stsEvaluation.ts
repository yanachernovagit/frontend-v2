type StsPercentiles = {
  p25: number;
  p75: number;
};

const STS_TABLE: {
  minAge: number;
  maxAge: number;
  percentiles: StsPercentiles;
}[] = [
  { minAge: 18, maxAge: 29, percentiles: { p25: 17, p75: 24 } },
  { minAge: 30, maxAge: 39, percentiles: { p25: 18, p75: 23 } },
  { minAge: 40, maxAge: 49, percentiles: { p25: 15, p75: 20 } },
  { minAge: 50, maxAge: 59, percentiles: { p25: 14, p75: 20 } },
  { minAge: 60, maxAge: 69, percentiles: { p25: 12, p75: 19 } },
  { minAge: 70, maxAge: 80, percentiles: { p25: 11, p75: 17 } },
];

export function getAgeFromBirthDate(birthDate: string): number {
  const birth = new Date(birthDate);
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
): { message: string; level: "below" | "within" | "above" } | null {
  const row = STS_TABLE.find((r) => age >= r.minAge && age <= r.maxAge);
  if (!row) return null;

  const { p25, p75 } = row.percentiles;

  if (repetitions <= p25) {
    return {
      level: "below",
      message:
        "Tu resultado está por debajo de lo esperado para tu edad. Se recomienda iniciar entrenamiento de fuerza y resistencia de extremidades inferiores ¡Comencemos!",
    };
  }
  if (repetitions >= p75) {
    return {
      level: "above",
      message:
        "Tu resultado está sobre lo esperado para tu edad. ¡Continúa así!",
    };
  }
  return {
    level: "within",
    message:
      "Tu resultado está dentro de lo esperado para tu edad. ¡Buen trabajo! Mantén tu nivel de actividad física.",
  };
}
