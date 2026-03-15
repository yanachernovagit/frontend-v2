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
import { Evaluation } from "@/types";
import { MediaUploadField } from "@/components/admin/media/MediaUploadField";
import { EvaluationTypeEnum } from "@/constants/enums";
import {
  buildExpectedResultsByType,
  buildMovementExpectedResults,
  DEFAULT_MEASURE_LABELS,
  getMovementCount,
  normalizeMeasureExpectedResults,
} from "@/components/admin/evaluations/expectedResults";

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
    measureLeftLabel: z.string().optional(),
    measureRightLabel: z.string().optional(),
    measureDifferenceLabel: z.string().optional(),
    movementCount: z
      .string()
      .min(1, "La cantidad de alternativas es requerida.")
      .refine(
        (value) => Number.isFinite(Number(value)) && Number(value) >= 1,
        "Debe ser mayor o igual a 1.",
      ),
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
      measureLeftLabel: DEFAULT_MEASURE_LABELS.leftVolume,
      measureRightLabel: DEFAULT_MEASURE_LABELS.rightVolume,
      measureDifferenceLabel: DEFAULT_MEASURE_LABELS.difference,
      movementCount: "4",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "timeResults",
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
        measureLeftLabel: normalizedMeasure.leftVolume,
        measureRightLabel: normalizedMeasure.rightVolume,
        measureDifferenceLabel: normalizedMeasure.difference,
        movementCount: String(getMovementCount(initialData.expectedResults)),
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
        measureLeftLabel: DEFAULT_MEASURE_LABELS.leftVolume,
        measureRightLabel: DEFAULT_MEASURE_LABELS.rightVolume,
        measureDifferenceLabel: DEFAULT_MEASURE_LABELS.difference,
        movementCount: "4",
      });
    }
  }, [initialData, form, open]);

  const handleSubmit = async (values: FormValues) => {
    const expectedResults = buildExpectedResultsByType({
      type: values.type,
      timeLabels: values.timeResults.map((item) => item.label),
      measureLabels: {
        leftVolume:
          values.measureLeftLabel?.trim() || DEFAULT_MEASURE_LABELS.leftVolume,
        rightVolume:
          values.measureRightLabel?.trim() ||
          DEFAULT_MEASURE_LABELS.rightVolume,
        difference:
          values.measureDifferenceLabel?.trim() ||
          DEFAULT_MEASURE_LABELS.difference,
      },
      movementCount: Number(values.movementCount),
    });

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
    });
  };

  const selectedType = form.watch("type");
  const movementCount = Number(form.watch("movementCount") || 1);

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
                <>
                  <FormField
                    control={form.control}
                    name="movementCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black-400 text-sm font-semibold">
                          Cantidad de alternativas
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(event) =>
                              field.onChange(event.target.value)
                            }
                            className="border-2 border-gray-100 focus:border-purple transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="rounded-xl border border-purple/20 bg-white p-4">
                    <p className="text-sm font-semibold text-black-400 mb-2">
                      Vista previa generada automáticamente
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(
                        buildMovementExpectedResults(movementCount),
                      ).map(([, value]) => (
                        <div
                          key={value}
                          className="text-sm border border-gray-200 rounded-md px-3 py-2"
                        >
                          <span className="text-black-400">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
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
