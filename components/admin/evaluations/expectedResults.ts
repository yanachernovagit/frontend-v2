import { EvaluationTypeEnum } from "@/constants/enums";

type ExpectedResults = Record<string, string>;

export const DEFAULT_MEASURE_LABELS: ExpectedResults = {
  difference: "Medición de centímetros",
  leftVolume: "Volumen brazo izquierdo",
  rightVolume: "Volumen brazo derecho",
};

function stripDiacritics(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function toCamelCase(value: string) {
  const parts = stripDiacritics(value)
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "resultado";

  const [first, ...rest] = parts;
  const camel = `${first}${rest.map((part) => part[0].toUpperCase() + part.slice(1)).join("")}`;

  return /^[0-9]/.test(camel) ? `resultado${camel}` : camel;
}

function mapSpecialTimeKey(label: string) {
  const normalized = stripDiacritics(label)
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  if (
    normalized.includes("numero de flexiones") ||
    normalized.includes("numero de repeticiones")
  ) {
    return "count";
  }
  return null;
}

export function buildTimeKeyFromLabel(label: string) {
  return mapSpecialTimeKey(label) ?? toCamelCase(label);
}

function mapMeasureCanonicalKey(rawKey: string) {
  const normalized = stripDiacritics(rawKey).replace(/[^a-z0-9]/g, "");

  if (
    normalized.includes("leftvolume") ||
    normalized.includes("volumenbrazoizquierdo") ||
    normalized.includes("volumenizquierdo") ||
    normalized.includes("izquierdo") ||
    normalized.includes("left")
  ) {
    return "leftVolume";
  }

  if (
    normalized.includes("rightvolume") ||
    normalized.includes("volumenbrazoderecho") ||
    normalized.includes("volumenderecho") ||
    normalized.includes("derecho") ||
    normalized.includes("right")
  ) {
    return "rightVolume";
  }

  if (normalized.includes("difference") || normalized.includes("diferencia")) {
    return "difference";
  }

  return null;
}

export function normalizeMeasureExpectedResults(
  incoming?: ExpectedResults | null,
) {
  const normalized: ExpectedResults = { ...DEFAULT_MEASURE_LABELS };

  if (!incoming) return normalized;

  Object.entries(incoming).forEach(([key, value]) => {
    const canonical = mapMeasureCanonicalKey(key);
    if (canonical && value?.trim()) {
      normalized[canonical] = value.trim();
    }
  });

  return normalized;
}

export function getMovementCount(incoming?: ExpectedResults | null) {
  if (!incoming) return 4;

  const levelKeys = Object.keys(incoming)
    .map((key) => {
      const match = key.match(/^nivel_(\d+)$/i);
      return match ? Number(match[1]) : null;
    })
    .filter((value): value is number => value !== null);

  if (levelKeys.length > 0) {
    return Math.max(1, Math.max(...levelKeys));
  }

  const withoutNone = Object.keys(incoming).filter(
    (key) => stripDiacritics(key) !== "ninguna",
  );
  return Math.max(1, withoutNone.length || 4);
}

function getLetterFromIndex(index: number) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const base = alphabet[index % alphabet.length];
  const cycle = Math.floor(index / alphabet.length);
  return cycle === 0 ? base : `${base}${cycle + 1}`;
}

export function buildMovementExpectedResults(count: number) {
  const safeCount = Math.max(1, Math.floor(count || 1));
  const result: ExpectedResults = {};

  for (let index = 0; index < safeCount; index += 1) {
    result[`nivel_${index + 1}`] = getLetterFromIndex(index);
  }

  result.ninguna = "Ninguna";
  return result;
}

export function buildExpectedResultsByType(params: {
  type: EvaluationTypeEnum;
  timeLabels: string[];
  measureLabels: ExpectedResults;
  movementCount: number;
}) {
  const { type, timeLabels, measureLabels, movementCount } = params;

  if (type === EvaluationTypeEnum.MEASURE) {
    return normalizeMeasureExpectedResults(measureLabels);
  }

  if (type === EvaluationTypeEnum.MOVEMENT_RANGE) {
    return buildMovementExpectedResults(movementCount);
  }

  const result: ExpectedResults = {};
  const seen = new Set<string>();

  timeLabels
    .map((label) => label.trim())
    .filter((label) => label.length > 0)
    .forEach((label) => {
      const baseKey = buildTimeKeyFromLabel(label);
      let finalKey = baseKey;
      let index = 2;

      while (seen.has(finalKey)) {
        finalKey = `${baseKey}_${index}`;
        index += 1;
      }

      seen.add(finalKey);
      result[finalKey] = label;
    });

  return result;
}
