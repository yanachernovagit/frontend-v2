"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import {
  Evaluation,
  GenericTimeFeedbackRules,
  MeasureFeedbackRules,
  MovementFeedbackRules,
  StsTimeFeedbackRules,
} from "@/types";
import { MediaUploadField } from "@/components/admin/media/MediaUploadField";
import { EvaluationTypeEnum } from "@/constants/enums";
import {
  buildExpectedResultsByType,
  DEFAULT_MEASURE_LABELS,
  getMovementCount,
  normalizeMeasureExpectedResults,
} from "@/components/admin/evaluations/expectedResults";

const DEFAULT_STS_AGE_RANGES = [
  { minAge: 18, maxAge: 29, p25: 17, p75: 24 },
  { minAge: 30, maxAge: 39, p25: 18, p75: 23 },
  { minAge: 40, maxAge: 49, p25: 15, p75: 20 },
  { minAge: 50, maxAge: 59, p25: 14, p75: 20 },
  { minAge: 60, maxAge: 69, p25: 12, p75: 19 },
  { minAge: 70, maxAge: 80, p25: 11, p75: 17 },
];

const DEFAULT_STS_MESSAGES = {
  above: "Tu resultado está sobre lo esperado para tu edad. ¡Continúa así!",
  below:
    "Tu resultado está por debajo de lo esperado para tu edad. Se recomienda iniciar entrenamiento de fuerza y resistencia de extremidades inferiores ¡Comencemos!",
  within:
    "Tu resultado está dentro de lo esperado para tu edad. ¡Buen trabajo! Mantén tu nivel de actividad física.",
};

const EMPTY_TIME_FEEDBACK_RANGE = {
  min: 0,
  max: null,
  level: "",
  message: "",
};

const DEFAULT_MEASURE_FEEDBACK_RANGES = [
  { min: 0, max: 150, level: "normalidad", message: "Normalidad" },
  {
    min: 150.000001,
    max: 200,
    level: "sugerencia_consulta",
    message: "Se sugiere consultar con kinesiólogo",
  },
  {
    min: 200.000001,
    max: null,
    level: "consulta_precoz",
    message: "Consultar de forma precoz con kinesiólogo",
  },
];

const DEFAULT_MOVEMENT_FEEDBACK = {
  A: "Tu movilidad de hombro está dentro de lo esperado. ¡Muy bien! Te recomendamos seguir realizando tus ejercicios para mantener el movimiento.",
  B: "Tu movilidad de hombro está disminuida. Te recomendamos comenzar ejercicios de movilidad al menos 3 veces al día para ayudar a recuperarla.",
  C: "Tu movilidad de hombro está disminuida. Te recomendamos comenzar ejercicios de movilidad al menos 3 veces al día para ayudar a recuperarla.",
  D: "Tu movilidad de hombro está disminuida. Te recomendamos comenzar ejercicios de movilidad al menos 3 veces al día para ayudar a recuperarla.",
  Ninguna:
    "No te preocupes. Los ejercicios te ayudarán a mejorar este resultado de forma progresiva.",
} as const;

const evaluationSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().min(1, "La descripcion es requerida"),
    howToDo: z.string().min(1, "Las instrucciones son requeridas"),
    imageUrl: z.string().url().optional().or(z.literal("")),
    logoUrl: z.string().url().optional().or(z.literal("")),
    videoUrl: z.string().url().optional().or(z.literal("")),
    type: z.nativeEnum(EvaluationTypeEnum),
    seconds: z.number().min(0).optional(),
    order: z.number().min(0),
    timeResults: z.array(z.object({ label: z.string() })),
    timeMetricKey: z.string(),
    timeRanges: z.array(
      z.object({
        min: z.number(),
        max: z.number().nullable(),
        level: z.string(),
        message: z.string(),
      }),
    ),
    measureLeftLabel: z.string().optional(),
    measureRightLabel: z.string().optional(),
    measureDifferenceLabel: z.string().optional(),
    stsMetricKey: z.string().min(1, "La métrica es requerida"),
    stsAgeRanges: z.array(
      z.object({
        minAge: z.number(),
        maxAge: z.number(),
        p25: z.number(),
        p75: z.number(),
      }),
    ),
    stsMessageAbove: z.string().min(1, "Mensaje requerido"),
    stsMessageWithin: z.string().min(1, "Mensaje requerido"),
    stsMessageBelow: z.string().min(1, "Mensaje requerido"),
    measureRanges: z.array(
      z.object({
        min: z.number(),
        max: z.number().nullable(),
        level: z.string().min(1, "Nivel requerido"),
        message: z.string().min(1, "Mensaje requerido"),
      }),
    ),
    movementOptions: z.array(
      z.object({
        label: z.string().min(1, "Texto requerido"),
        message: z.string().min(1, "Mensaje requerido"),
      }),
    ),
    movementNoneLabel: z.string().min(1, "Texto requerido"),
    movementNoneMessage: z.string().min(1, "Mensaje requerido"),
  })
  .superRefine((values, ctx) => {
    if (values.type === EvaluationTypeEnum.TIME) {
      const hasAtLeastOne = values.timeResults.some(
        (item) => item.label.trim().length > 0,
      );

      if (!hasAtLeastOne) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["timeResults"],
          message: "Debes agregar al menos un resultado esperado.",
        });
      }

      if (isStsEvaluationName(values.name)) {
        if (values.stsAgeRanges.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["stsAgeRanges"],
            message: "Debes agregar al menos un rango etario.",
          });
        }

        values.stsAgeRanges.forEach((range, index) => {
          if (range.minAge > range.maxAge) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["stsAgeRanges", index, "maxAge"],
              message: "La edad máxima debe ser mayor o igual a la mínima.",
            });
          }

          if (range.p25 > range.p75) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["stsAgeRanges", index, "p75"],
              message: "El percentil 75 debe ser mayor o igual al 25.",
            });
          }
        });
      } else if (
        values.timeMetricKey.trim().length > 0 ||
        values.timeRanges.length > 0
      ) {
        if (!values.timeMetricKey.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["timeMetricKey"],
            message: "La métrica es requerida.",
          });
        }

        if (values.timeRanges.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["timeRanges"],
            message: "Debes agregar al menos un rango.",
          });
        }

        values.timeRanges.forEach((range, index) => {
          if (range.max !== null && range.min > range.max) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["timeRanges", index, "max"],
              message: "El máximo debe ser mayor o igual al mínimo.",
            });
          }

          if (!range.level.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["timeRanges", index, "level"],
              message: "El nivel es requerido.",
            });
          }

          if (!range.message.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["timeRanges", index, "message"],
              message: "El mensaje es requerido.",
            });
          }
        });
      }
    }

    if (values.type === EvaluationTypeEnum.MEASURE) {
      if (!values.measureLeftLabel?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["measureLeftLabel"],
          message: "El texto del brazo izquierdo es requerido.",
        });
      }

      if (!values.measureRightLabel?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["measureRightLabel"],
          message: "El texto del brazo derecho es requerido.",
        });
      }

      if (!values.measureDifferenceLabel?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["measureDifferenceLabel"],
          message: "El texto de la diferencia es requerido.",
        });
      }

      if (values.measureRanges.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["measureRanges"],
          message: "Debes agregar al menos un rango.",
        });
      }

      values.measureRanges.forEach((range, index) => {
        if (range.max !== null && range.min > range.max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["measureRanges", index, "max"],
            message: "El máximo debe ser mayor o igual al mínimo.",
          });
        }
      });
    }

    if (values.type === EvaluationTypeEnum.MOVEMENT_RANGE) {
      if (values.movementOptions.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["movementOptions"],
          message: "Debes agregar al menos una alternativa.",
        });
      }

      const normalized = values.movementOptions.map((item) =>
        item.label.trim().toLowerCase(),
      );
      const duplicates = normalized.some(
        (label, index) => label && normalized.indexOf(label) !== index,
      );

      if (duplicates) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["movementOptions"],
          message: "Las alternativas no pueden repetirse.",
        });
      }
    }
  });

type FormValues = z.infer<typeof evaluationSchema>;

interface EvaluationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Evaluation>) => Promise<void>;
  initialData: Evaluation | null;
  isLoading?: boolean;
}

function normalizeUrl(value?: string) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function stripDiacritics(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function isStsEvaluationName(name?: string) {
  const normalized = stripDiacritics(name ?? "");
  return (
    normalized.includes("sentarse y levantarse") ||
    normalized.includes("sentarse levantarse") ||
    normalized.includes("sts")
  );
}

function getLetterFromIndex(index: number) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const base = alphabet[index % alphabet.length];
  const cycle = Math.floor(index / alphabet.length);
  return cycle === 0 ? base : `${base}${cycle + 1}`;
}

function getDefaultMovementMessage(label: string) {
  return (
    DEFAULT_MOVEMENT_FEEDBACK[
      label as keyof typeof DEFAULT_MOVEMENT_FEEDBACK
    ] ?? DEFAULT_MOVEMENT_FEEDBACK.C
  );
}

function buildMovementExpectedResults(
  options: FormValues["movementOptions"],
  noneLabel: string,
) {
  const expectedResults: Record<string, string> = {};

  options.forEach((option, index) => {
    expectedResults[`nivel_${index + 1}`] = option.label.trim();
  });

  expectedResults.ninguna = noneLabel.trim();
  return expectedResults;
}

function getStsTimeFeedbackRules(
  rules?: Evaluation["feedbackRules"],
): StsTimeFeedbackRules | null {
  if (!rules || !("ageRanges" in rules) || !("stsMessages" in rules)) {
    return null;
  }

  return rules as StsTimeFeedbackRules;
}

function getGenericTimeFeedbackRules(
  rules?: Evaluation["feedbackRules"],
): GenericTimeFeedbackRules | null {
  if (
    !rules ||
    !("metricKey" in rules) ||
    !("ranges" in rules) ||
    "ageRanges" in rules
  ) {
    return null;
  }

  return rules as GenericTimeFeedbackRules;
}

function getMeasureFeedbackRules(
  rules?: Evaluation["feedbackRules"],
): MeasureFeedbackRules | null {
  if (!rules || !("ranges" in rules)) {
    return null;
  }

  return rules as MeasureFeedbackRules;
}

function getMovementFeedbackRules(
  rules?: Evaluation["feedbackRules"],
): MovementFeedbackRules | null {
  if (!rules || !("valueFeedback" in rules)) {
    return null;
  }

  return rules as MovementFeedbackRules;
}

function buildMovementFormDefaults(
  expectedResults?: Record<string, string> | null,
  feedbackRules?: Evaluation["feedbackRules"],
) {
  const valueFeedback =
    getMovementFeedbackRules(feedbackRules)?.valueFeedback ?? {};
  const count = getMovementCount(expectedResults);

  const movementOptions = Array.from({ length: count }, (_, index) => {
    const key = `nivel_${index + 1}`;
    const fallbackLabel = getLetterFromIndex(index);
    const label = expectedResults?.[key]?.trim() || fallbackLabel;
    const message =
      valueFeedback[label]?.message ?? getDefaultMovementMessage(label);

    return {
      label,
      message,
    };
  });

  const noneLabel = expectedResults?.ninguna?.trim() || "Ninguna";
  const noneMessage =
    valueFeedback["Ninguna"]?.message ??
    valueFeedback[noneLabel]?.message ??
    getDefaultMovementMessage("Ninguna");

  return {
    movementOptions,
    movementNoneLabel: "Ninguna",
    movementNoneMessage: noneMessage,
  };
}

export function EvaluationFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: EvaluationFormModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      name: "",
      description: "",
      howToDo: "",
      imageUrl: "",
      logoUrl: "",
      videoUrl: "",
      type: EvaluationTypeEnum.MEASURE,
      seconds: 0,
      order: 0,
      timeResults: [{ label: "" }],
      timeMetricKey: "",
      timeRanges: [],
      measureLeftLabel: DEFAULT_MEASURE_LABELS.leftVolume,
      measureRightLabel: DEFAULT_MEASURE_LABELS.rightVolume,
      measureDifferenceLabel: DEFAULT_MEASURE_LABELS.difference,
      stsMetricKey: "count",
      stsAgeRanges: DEFAULT_STS_AGE_RANGES,
      stsMessageAbove: DEFAULT_STS_MESSAGES.above,
      stsMessageWithin: DEFAULT_STS_MESSAGES.within,
      stsMessageBelow: DEFAULT_STS_MESSAGES.below,
      measureRanges: DEFAULT_MEASURE_FEEDBACK_RANGES,
      movementOptions: [
        { label: "A", message: DEFAULT_MOVEMENT_FEEDBACK.A },
        { label: "B", message: DEFAULT_MOVEMENT_FEEDBACK.B },
        { label: "C", message: DEFAULT_MOVEMENT_FEEDBACK.C },
        { label: "D", message: DEFAULT_MOVEMENT_FEEDBACK.D },
      ],
      movementNoneLabel: "Ninguna",
      movementNoneMessage: DEFAULT_MOVEMENT_FEEDBACK.Ninguna,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "timeResults",
  });

  const {
    fields: timeRangeFields,
    append: appendTimeRange,
    remove: removeTimeRange,
  } = useFieldArray({
    control: form.control,
    name: "timeRanges",
  });

  const {
    fields: stsRangeFields,
    append: appendStsRange,
    remove: removeStsRange,
  } = useFieldArray({
    control: form.control,
    name: "stsAgeRanges",
  });

  const {
    fields: measureRangeFields,
    append: appendMeasureRange,
    remove: removeMeasureRange,
  } = useFieldArray({
    control: form.control,
    name: "measureRanges",
  });

  const {
    fields: movementOptionFields,
    append: appendMovementOption,
    remove: removeMovementOption,
  } = useFieldArray({
    control: form.control,
    name: "movementOptions",
  });

  useEffect(() => {
    if (initialData) {
      const initialType =
        initialData.type ??
        (initialData.isTime
          ? EvaluationTypeEnum.TIME
          : EvaluationTypeEnum.MEASURE);

      const normalizedMeasure = normalizeMeasureExpectedResults(
        initialData.expectedResults,
      );

      const timeResults =
        initialType === EvaluationTypeEnum.TIME
          ? Object.values(initialData.expectedResults ?? {}).map((label) => ({
              label,
            }))
          : [{ label: "" }];

      const stsTimeFeedback = getStsTimeFeedbackRules(
        initialData.feedbackRules,
      );
      const genericTimeFeedback = getGenericTimeFeedbackRules(
        initialData.feedbackRules,
      );
      const measureFeedback = getMeasureFeedbackRules(
        initialData.feedbackRules,
      );
      const movementFormDefaults = buildMovementFormDefaults(
        initialData.expectedResults,
        initialData.feedbackRules,
      );
      const genericTimeRanges =
        genericTimeFeedback?.ranges?.map((item) => ({
          min: item.min,
          max: item.max ?? null,
          level: item.level,
          message: item.message,
        })) ?? [];
      const stsAgeRanges = stsTimeFeedback?.ageRanges ?? [];
      const measureRanges =
        measureFeedback?.ranges?.map((item) => ({
          min: item.min,
          max: item.max ?? null,
          level: item.level,
          message: item.message,
        })) ?? [];

      form.reset({
        name: initialData.name,
        description: initialData.description,
        howToDo: initialData.howToDo,
        imageUrl: initialData.imageUrl || "",
        logoUrl: initialData.logoUrl || "",
        videoUrl: initialData.videoUrl || "",
        type: initialType,
        seconds: initialData.seconds || 0,
        order: initialData.order,
        timeResults: timeResults.length > 0 ? timeResults : [{ label: "" }],
        timeMetricKey: genericTimeFeedback?.metricKey ?? "",
        timeRanges: genericTimeRanges,
        measureLeftLabel: normalizedMeasure.leftVolume,
        measureRightLabel: normalizedMeasure.rightVolume,
        measureDifferenceLabel: normalizedMeasure.difference,
        stsMetricKey: stsTimeFeedback?.metricKey || "count",
        stsAgeRanges: stsAgeRanges.length > 0 ? stsAgeRanges : DEFAULT_STS_AGE_RANGES,
        stsMessageAbove:
          stsTimeFeedback?.stsMessages?.above || DEFAULT_STS_MESSAGES.above,
        stsMessageWithin:
          stsTimeFeedback?.stsMessages?.within || DEFAULT_STS_MESSAGES.within,
        stsMessageBelow:
          stsTimeFeedback?.stsMessages?.below || DEFAULT_STS_MESSAGES.below,
        measureRanges:
          measureRanges.length > 0
            ? measureRanges
            : DEFAULT_MEASURE_FEEDBACK_RANGES,
        movementOptions: movementFormDefaults.movementOptions,
        movementNoneLabel: movementFormDefaults.movementNoneLabel,
        movementNoneMessage: movementFormDefaults.movementNoneMessage,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        howToDo: "",
        imageUrl: "",
        logoUrl: "",
        videoUrl: "",
        type: EvaluationTypeEnum.MEASURE,
        seconds: 0,
        order: 0,
        timeResults: [{ label: "" }],
        timeMetricKey: "",
        timeRanges: [],
        measureLeftLabel: DEFAULT_MEASURE_LABELS.leftVolume,
        measureRightLabel: DEFAULT_MEASURE_LABELS.rightVolume,
        measureDifferenceLabel: DEFAULT_MEASURE_LABELS.difference,
        stsMetricKey: "count",
        stsAgeRanges: DEFAULT_STS_AGE_RANGES,
        stsMessageAbove: DEFAULT_STS_MESSAGES.above,
        stsMessageWithin: DEFAULT_STS_MESSAGES.within,
        stsMessageBelow: DEFAULT_STS_MESSAGES.below,
        measureRanges: DEFAULT_MEASURE_FEEDBACK_RANGES,
        movementOptions: [
          { label: "A", message: DEFAULT_MOVEMENT_FEEDBACK.A },
          { label: "B", message: DEFAULT_MOVEMENT_FEEDBACK.B },
          { label: "C", message: DEFAULT_MOVEMENT_FEEDBACK.C },
          { label: "D", message: DEFAULT_MOVEMENT_FEEDBACK.D },
        ],
        movementNoneLabel: "Ninguna",
        movementNoneMessage: DEFAULT_MOVEMENT_FEEDBACK.Ninguna,
      });
    }
  }, [initialData, form, open]);

  const handleSubmit = async (values: FormValues) => {
    const expectedResults =
      values.type === EvaluationTypeEnum.MOVEMENT_RANGE
        ? buildMovementExpectedResults(
            values.movementOptions,
            values.movementNoneLabel,
          )
        : buildExpectedResultsByType({
            type: values.type,
            timeLabels: values.timeResults.map((item) => item.label),
            measureLabels: {
              leftVolume:
                values.measureLeftLabel?.trim() ||
                DEFAULT_MEASURE_LABELS.leftVolume,
              rightVolume:
                values.measureRightLabel?.trim() ||
                DEFAULT_MEASURE_LABELS.rightVolume,
              difference:
                values.measureDifferenceLabel?.trim() ||
                DEFAULT_MEASURE_LABELS.difference,
            },
            movementCount: values.movementOptions.length,
          });

    let feedbackRules: Evaluation["feedbackRules"] | undefined;

    if (
      values.type === EvaluationTypeEnum.TIME &&
      isStsEvaluationName(values.name)
    ) {
      feedbackRules = {
        metricKey: values.stsMetricKey.trim(),
        ageRanges: values.stsAgeRanges.map((item) => ({
          minAge: item.minAge,
          maxAge: item.maxAge,
          p25: item.p25,
          p75: item.p75,
        })),
        stsMessages: {
          above: values.stsMessageAbove.trim(),
          below: values.stsMessageBelow.trim(),
          within: values.stsMessageWithin.trim(),
        },
      };
    } else if (values.type === EvaluationTypeEnum.TIME) {
      const metricKey = values.timeMetricKey.trim();
      const ranges = values.timeRanges
        .map((item) => ({
          min: item.min,
          max: item.max ?? undefined,
          level: item.level.trim(),
          message: item.message.trim(),
        }))
        .filter(
          (item) =>
            item.level.length > 0 ||
            item.message.length > 0 ||
            item.min !== 0 ||
            item.max !== undefined,
        );

      if (metricKey && ranges.length > 0) {
        feedbackRules = {
          metricKey,
          ranges,
        };
      }
    }

    if (values.type === EvaluationTypeEnum.MEASURE) {
      const metricKeyFromStored = getMeasureFeedbackRules(
        initialData?.feedbackRules,
      )?.metricKey;
      feedbackRules = {
        metricKey: metricKeyFromStored || "difference",
        ranges: values.measureRanges.map((item) => ({
          min: item.min,
          max: item.max ?? undefined,
          level: item.level.trim(),
          message: item.message.trim(),
        })),
      };
    }

    if (values.type === EvaluationTypeEnum.MOVEMENT_RANGE) {
      const valueFeedback: MovementFeedbackRules["valueFeedback"] = {};

      values.movementOptions.forEach((option) => {
        const label = option.label.trim();
        valueFeedback[label] = {
          level: label,
          message: option.message.trim(),
        };
      });

      const noneLabel = values.movementNoneLabel.trim();
      valueFeedback[noneLabel] = {
        level: "ninguna",
        message: values.movementNoneMessage.trim(),
      };

      feedbackRules = { valueFeedback };
    }

    await onSubmit({
      name: values.name,
      description: values.description,
      howToDo: values.howToDo,
      imageUrl: normalizeUrl(values.imageUrl),
      logoUrl: normalizeUrl(values.logoUrl),
      videoUrl: normalizeUrl(values.videoUrl),
      type: values.type,
      isTime: values.type === EvaluationTypeEnum.TIME,
      seconds:
        values.type === EvaluationTypeEnum.TIME
          ? (values.seconds ?? 0)
          : undefined,
      order: values.order,
      expectedResults,
      feedbackRules,
    });
  };

  const selectedType = form.watch("type");
  const watchedName = form.watch("name");
  const isStsByName = isStsEvaluationName(watchedName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border border-purple/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <DialogHeader className="relative pb-5 border-b border-purple/15 bg-gradient-to-br from-white via-purple/4 to-magent/6 -m-6 mb-0 p-6 rounded-t-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-magent/15 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple/10 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <div className="h-1 w-10 bg-gradient-to-r from-purple via-magent to-purple rounded-full shadow-sm" />
            <DialogTitle className="text-xl font-bold text-black drop-shadow-sm">
              {initialData ? "Editar evaluación" : "Crear nueva evaluación"}
            </DialogTitle>
          </div>
          <p className="text-xs text-black-400 mt-2 font-medium ml-[52px] relative z-10">
            Completa la información de la evaluación
          </p>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5 pt-4"
          >
            <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/4 to-magent/5 border border-purple/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-magent/10 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2.5 pb-1 relative z-10">
                <div className="w-1 h-5 bg-gradient-to-b from-purple via-magent to-purple rounded-full shadow-sm" />
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                  Información básica
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-black-400 text-sm font-semibold">
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-2 border-gray-100 focus:border-purple transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black-400 text-sm font-semibold">
                        Orden
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                          className="border-2 border-gray-100 focus:border-purple transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-400 text-sm font-semibold">
                      Tipo de evaluación
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectItem value={EvaluationTypeEnum.TIME}>
                          Tiempo
                        </SelectItem>
                        <SelectItem value={EvaluationTypeEnum.MEASURE}>
                          Medición
                        </SelectItem>
                        <SelectItem value={EvaluationTypeEnum.MOVEMENT_RANGE}>
                          Rango de movimiento
                        </SelectItem>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-400 text-sm font-semibold">
                      Descripción
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        className="border-2 border-gray-100 focus:border-purple resize-none transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="howToDo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-400 text-sm font-semibold">
                      Cómo realizarla
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        className="border-2 border-gray-100 focus:border-purple resize-none transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/4 to-magent/5 border border-purple/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-magent/10 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2.5 pb-1 relative z-10">
                <div className="w-1 h-5 bg-gradient-to-b from-purple via-magent to-purple rounded-full shadow-sm" />
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                  Recursos multimedia
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black-400 text-sm font-semibold">
                        URL de imagen
                      </FormLabel>
                      <MediaUploadField
                        accept="image/*"
                        folder="evaluations/images"
                        disabled={isLoading}
                        onUploaded={(url) =>
                          form.setValue("imageUrl", url, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://..."
                          className="border-2 border-gray-100 focus:border-purple transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black-400 text-sm font-semibold">
                        URL de logo
                      </FormLabel>
                      <MediaUploadField
                        accept="image/*"
                        folder="evaluations/logos"
                        disabled={isLoading}
                        onUploaded={(url) =>
                          form.setValue("logoUrl", url, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://..."
                          className="border-2 border-gray-100 focus:border-purple transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-400 text-sm font-semibold">
                      URL de video
                    </FormLabel>
                    <MediaUploadField
                      accept="video/*"
                      folder="evaluations/videos"
                      disabled={isLoading}
                      onUploaded={(url) =>
                        form.setValue("videoUrl", url, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://..."
                        className="border-2 border-gray-100 focus:border-purple transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/4 to-magent/5 border border-purple/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-magent/10 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2.5 pb-1 relative z-10">
                <div className="w-1 h-5 bg-gradient-to-b from-purple via-magent to-purple rounded-full shadow-sm" />
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                  Resultados esperados
                </h3>
              </div>

              {selectedType === EvaluationTypeEnum.TIME && (
                <>
                  <FormField
                    control={form.control}
                    name="seconds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black-400 text-sm font-semibold">
                          Duración en segundos
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(Number(event.target.value))
                            }
                            className="border-2 border-gray-100 focus:border-purple transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-black-400">
                      Campos de resultado
                    </p>
                    {fields.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`timeResults.${index}.label`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Ej: Número de flexiones"
                                  className="border-2 border-gray-100 focus:border-purple transition-colors"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline_magent"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline_magent"
                      onClick={() => append({ label: "" })}
                      className="w-fit"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar resultado
                    </Button>

                    <FormField
                      control={form.control}
                      name="timeResults"
                      render={() => (
                        <FormItem>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {selectedType === EvaluationTypeEnum.MEASURE && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="measureLeftLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black-400 text-sm font-semibold">
                          Brazo izquierdo
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-2 border-gray-100 focus:border-purple transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="measureRightLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black-400 text-sm font-semibold">
                          Brazo derecho
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-2 border-gray-100 focus:border-purple transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="measureDifferenceLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black-400 text-sm font-semibold">
                          Diferencia
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-2 border-gray-100 focus:border-purple transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {selectedType === EvaluationTypeEnum.MOVEMENT_RANGE && (
                <div className="space-y-4">
                  <p className="text-sm text-black-400 font-semibold">
                    Las alternativas se generan automáticamente. Solo puedes
                    editar el mensaje de feedback.
                  </p>

                  {movementOptionFields.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-purple/20 bg-white p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-black-400">
                          Alternativa {index + 1}
                        </p>
                        <Button
                          type="button"
                          variant="outline_magent"
                          size="icon"
                          onClick={() => removeMovementOption(index)}
                          disabled={movementOptionFields.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div>
                        <p className="text-xs text-black-400 font-semibold">
                          Alternativa
                        </p>
                        <p className="text-base font-semibold text-purple">
                          {item.label}
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name={`movementOptions.${index}.message`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black-400 text-sm font-semibold">
                              Feedback
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={2}
                                className="border-2 border-gray-100 focus:border-purple resize-none transition-colors"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline_magent"
                    onClick={() => {
                      const nextIndex = movementOptionFields.length;
                      const nextLabel = getLetterFromIndex(nextIndex);
                      appendMovementOption({
                        label: nextLabel,
                        message: getDefaultMovementMessage(nextLabel),
                      });
                    }}
                    className="w-fit"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar alternativa
                  </Button>

                  <div className="rounded-xl border border-purple/20 bg-white p-3 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-black-400">
                      Opción sin alternativa
                    </p>
                    <p className="text-base font-semibold text-purple">
                      Ninguna
                    </p>

                    <FormField
                      control={form.control}
                      name="movementNoneMessage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black-400 text-sm font-semibold">
                            Feedback para ninguna
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={2}
                              className="border-2 border-gray-100 focus:border-purple resize-none transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="movementOptions"
                    render={() => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/4 to-magent/5 border border-purple/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-magent/10 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2.5 pb-1 relative z-10">
                <div className="w-1 h-5 bg-gradient-to-b from-purple via-magent to-purple rounded-full shadow-sm" />
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                  Feedback configurable
                </h3>
              </div>

              {selectedType === EvaluationTypeEnum.TIME && (
                <>
                  {!isStsByName ? (
                    <div className="space-y-4">
                      <p className="text-sm text-black-400">
                        Configura la métrica y los rangos para mostrar feedback
                        en cualquier test de tiempo.
                      </p>

                      <FormField
                        control={form.control}
                        name="timeMetricKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black-400 text-sm font-semibold">
                              Métrica a evaluar
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ej: steps, count, stops"
                                className="border-2 border-gray-100 focus:border-purple transition-colors"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-black-400">
                          Rangos de feedback
                        </p>

                        {timeRangeFields.map((item, index) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-lg border border-purple/20 p-3 bg-white"
                          >
                            <FormField
                              control={form.control}
                              name={`timeRanges.${index}.min`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-black-400 font-semibold">
                                    Min
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(event) =>
                                        field.onChange(
                                          Number(event.target.value),
                                        )
                                      }
                                      className="border-2 border-gray-100 focus:border-purple transition-colors"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`timeRanges.${index}.max`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-black-400 font-semibold">
                                    Max (opcional)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      value={field.value ?? ""}
                                      onChange={(event) => {
                                        const next = event.target.value;
                                        field.onChange(
                                          next === "" ? null : Number(next),
                                        );
                                      }}
                                      className="border-2 border-gray-100 focus:border-purple transition-colors"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`timeRanges.${index}.level`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-black-400 font-semibold">
                                    Nivel
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Ej: normalidad, bajo"
                                      className="border-2 border-gray-100 focus:border-purple transition-colors"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`timeRanges.${index}.message`}
                              render={({ field }) => (
                                <FormItem className="md:col-span-4">
                                  <FormLabel className="text-xs text-black-400 font-semibold">
                                    Mensaje
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="border-2 border-gray-100 focus:border-purple transition-colors"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="md:col-span-4 flex justify-end">
                              <Button
                                type="button"
                                variant="outline_magent"
                                size="icon"
                                onClick={() => removeTimeRange(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline_magent"
                          onClick={() =>
                            appendTimeRange({ ...EMPTY_TIME_FEEDBACK_RANGE })
                          }
                          className="w-fit"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar rango
                        </Button>

                        <FormField
                          control={form.control}
                          name="timeRanges"
                          render={() => (
                            <FormItem>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="stsMetricKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black-400 text-sm font-semibold">
                              Métrica STS
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-2 border-gray-100 focus:border-purple transition-colors"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-black-400">
                          Percentiles por rango etario
                        </p>

                        {stsRangeFields.map((item, index) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-2 md:grid-cols-5 gap-2 rounded-lg border border-purple/20 p-3 bg-white"
                          >
                            <FormField
                              control={form.control}
                              name={`stsAgeRanges.${index}.minAge`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-black-400 font-semibold">
                                    Edad min
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(event) =>
                                        field.onChange(
                                          Number(event.target.value),
                                        )
                                      }
                                      className="border-2 border-gray-100 focus:border-purple transition-colors"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`stsAgeRanges.${index}.maxAge`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-black-400 font-semibold">
                                    Edad max
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(event) =>
                                        field.onChange(
                                          Number(event.target.value),
                                        )
                                      }
                                      className="border-2 border-gray-100 focus:border-purple transition-colors"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`stsAgeRanges.${index}.p25`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-black-400 font-semibold">
                                    P25
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(event) =>
                                        field.onChange(
                                          Number(event.target.value),
                                        )
                                      }
                                      className="border-2 border-gray-100 focus:border-purple transition-colors"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`stsAgeRanges.${index}.p75`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs text-black-400 font-semibold">
                                    P75
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(event) =>
                                        field.onChange(
                                          Number(event.target.value),
                                        )
                                      }
                                      className="border-2 border-gray-100 focus:border-purple transition-colors"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex items-end justify-end">
                              <Button
                                type="button"
                                variant="outline_magent"
                                size="icon"
                                onClick={() => removeStsRange(index)}
                                disabled={stsRangeFields.length <= 1}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline_magent"
                          onClick={() =>
                            appendStsRange({
                              minAge: 0,
                              maxAge: 0,
                              p25: 0,
                              p75: 0,
                            })
                          }
                          className="w-fit"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar rango etario
                        </Button>

                        <FormField
                          control={form.control}
                          name="stsAgeRanges"
                          render={() => (
                            <FormItem>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <FormField
                          control={form.control}
                          name="stsMessageAbove"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-black-400 text-sm font-semibold">
                                Mensaje: sobre lo esperado
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={2}
                                  className="border-2 border-gray-100 focus:border-purple resize-none transition-colors"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stsMessageWithin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-black-400 text-sm font-semibold">
                                Mensaje: dentro de lo esperado
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={2}
                                  className="border-2 border-gray-100 focus:border-purple resize-none transition-colors"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stsMessageBelow"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-black-400 text-sm font-semibold">
                                Mensaje: bajo lo esperado
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={2}
                                  className="border-2 border-gray-100 focus:border-purple resize-none transition-colors"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedType === EvaluationTypeEnum.MEASURE && (
                <div className="space-y-4">
                  <p className="text-sm text-black-400">
                    El nivel y la métrica se generan automáticamente. Solo edita
                    rangos y mensaje.
                  </p>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-black-400">
                      Rangos de feedback
                    </p>

                    {measureRangeFields.map((item, index) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-lg border border-purple/20 p-3 bg-white"
                      >
                        <FormField
                          control={form.control}
                          name={`measureRanges.${index}.min`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-black-400 font-semibold">
                                Min
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(event) =>
                                    field.onChange(Number(event.target.value))
                                  }
                                  className="border-2 border-gray-100 focus:border-purple transition-colors"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`measureRanges.${index}.max`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-black-400 font-semibold">
                                Max (opcional)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  value={field.value ?? ""}
                                  onChange={(event) => {
                                    const next = event.target.value;
                                    field.onChange(
                                      next === "" ? null : Number(next),
                                    );
                                  }}
                                  className="border-2 border-gray-100 focus:border-purple transition-colors"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`measureRanges.${index}.message`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="text-xs text-black-400 font-semibold">
                                Mensaje
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="border-2 border-gray-100 focus:border-purple transition-colors"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="md:col-span-5 flex justify-end">
                          <Button
                            type="button"
                            variant="outline_magent"
                            size="icon"
                            onClick={() => removeMeasureRange(index)}
                            disabled={measureRangeFields.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline_magent"
                      onClick={() =>
                        appendMeasureRange({
                          min: 0,
                          max: null,
                          level: `nivel_${measureRangeFields.length + 1}`,
                          message: "",
                        })
                      }
                      className="w-fit"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar rango
                    </Button>

                    <FormField
                      control={form.control}
                      name="measureRanges"
                      render={() => (
                        <FormItem>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {selectedType === EvaluationTypeEnum.MOVEMENT_RANGE && (
                <p className="text-sm text-black-400">
                  El feedback de cada alternativa se configura arriba junto con
                  el texto de la opción.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-purple/15 bg-gradient-to-br from-purple/4 to-magent/6 -mb-6 -mx-6 px-6 pb-6 rounded-b-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <Button
                type="button"
                variant="outline_magent"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="min-w-[110px] shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_0_rgba(235,68,156,0.2)] transition-all font-semibold relative z-10"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple to-magent hover:from-purple/90 hover:to-magent/90 min-w-[130px] shadow-[0_4px_12px_0_rgba(120,63,208,0.3)] hover:shadow-[0_6px_20px_0_rgba(120,63,208,0.4)] transition-all font-semibold border border-white/20 relative z-10"
              >
                {isLoading
                  ? "Guardando..."
                  : initialData
                    ? "Actualizar"
                    : "Crear evaluación"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
