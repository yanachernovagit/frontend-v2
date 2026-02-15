"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Dumbbell, ListChecks, ChevronRight } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PHASE_OPTIONS, STAGE_OPTIONS } from "@/constants/enums";
import {
  RoutineVariation,
  RoutineCatalog,
  ExerciseCatalog,
  CreateRoutineVariationPayload,
} from "@/types";

const exerciseEntrySchema = z.object({
  exerciseCatalogId: z.string().min(1, "Selecciona un ejercicio"),
  order: z.coerce.number().min(0),
});

const routineEntrySchema = z.object({
  routineCatalogId: z.string().min(1, "Selecciona una rutina"),
  order: z.coerce.number().min(0),
  exercises: z.array(exerciseEntrySchema),
});

const routineVariationSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phase: z.coerce.number().min(0),
  stage: z.coerce.number().min(0),
  routines: z.array(routineEntrySchema),
});

type FormValues = z.infer<typeof routineVariationSchema>;
type FormInputValues = z.input<typeof routineVariationSchema>;

interface RoutineVariationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateRoutineVariationPayload) => Promise<void>;
  initialData: RoutineVariation | null;
  isLoading?: boolean;
  routineCatalogs: RoutineCatalog[];
  exerciseCatalogs: ExerciseCatalog[];
}

function ExercisesPanel({
  routineIndex,
  control,
  exerciseCatalogs,
}: {
  routineIndex: number;
  control: ReturnType<typeof useForm<FormInputValues>>["control"];
  exerciseCatalogs: ExerciseCatalog[];
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `routines.${routineIndex}.exercises`,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {fields.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Dumbbell className="w-8 h-8 text-gray-200 mb-2" />
            <p className="text-sm text-gray-400">Sin ejercicios</p>
            <p className="text-xs text-gray-300 mt-0.5">
              Agrega ejercicios a esta rutina
            </p>
          </div>
        )}

        {fields.map((field, exIndex) => (
          <div
            key={field.id}
            className="flex items-center gap-2 group py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-[10px] text-gray-400 font-mono w-4 text-center shrink-0">
              {exIndex + 1}
            </span>
            <FormField
              control={control}
              name={`routines.${routineIndex}.exercises.${exIndex}.exerciseCatalogId`}
              render={({ field: selectField }) => (
                <FormItem className="flex-1 space-y-0">
                  <FormControl>
                    <Select
                      value={selectField.value}
                      onValueChange={selectField.onChange}
                      className="border border-gray-200 focus:border-purple transition-colors text-sm h-8"
                    >
                      <SelectItem value="">Seleccionar...</SelectItem>
                      {exerciseCatalogs.map((ex) => (
                        <SelectItem key={ex.id} value={ex.id}>
                          {ex.name} {ex.bodyPart ? `(${ex.bodyPart})` : ""}
                        </SelectItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`routines.${routineIndex}.exercises.${exIndex}.order`}
              render={({ field: orderField }) => (
                <FormItem className="w-12 space-y-0">
                  <FormControl>
                    <Input
                      type="number"
                      {...orderField}
                      value={
                        typeof orderField.value === "number"
                          ? orderField.value
                          : ""
                      }
                      onChange={(e) =>
                        orderField.onChange(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      className="border border-gray-200 focus:border-purple transition-colors text-sm h-8 text-center px-1"
                      placeholder="#"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <button
              type="button"
              onClick={() => remove(exIndex)}
              className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append({ exerciseCatalogId: "", order: fields.length })}
        className="flex items-center justify-center gap-1.5 text-xs text-magent hover:text-magent/80 font-medium py-2 px-2 rounded-lg hover:bg-magent/5 transition-colors border border-dashed border-magent/20 mt-2 shrink-0"
      >
        <Plus className="w-3.5 h-3.5" />
        Agregar ejercicio
      </button>
    </div>
  );
}

export function RoutineVariationFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
  routineCatalogs,
  exerciseCatalogs,
}: RoutineVariationFormModalProps) {
  const [activeRoutineIndex, setActiveRoutineIndex] = useState<number | null>(
    null,
  );

  const form = useForm<FormInputValues, unknown, FormValues>({
    resolver: zodResolver(routineVariationSchema),
    defaultValues: {
      name: "",
      phase: 0,
      stage: 0,
      routines: [],
    },
  });

  const {
    fields: routineFields,
    append: appendRoutine,
    remove: removeRoutine,
  } = useFieldArray({
    control: form.control,
    name: "routines",
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        phase: initialData.phase,
        stage: initialData.stage,
        routines: initialData.routines.map((r) => ({
          routineCatalogId: r.routineCatalogId,
          order: r.order,
          exercises: r.exercises.map((e) => ({
            exerciseCatalogId: e.exerciseCatalogId,
            order: e.order,
          })),
        })),
      });
      setActiveRoutineIndex(initialData.routines.length > 0 ? 0 : null);
    } else {
      form.reset({ name: "", phase: 0, stage: 0, routines: [] });
      setActiveRoutineIndex(null);
    }
  }, [initialData, form, open]);

  const handleSubmit = async (values: FormValues) => {
    await onSubmit(values);
  };

  const handleAddRoutine = () => {
    appendRoutine({
      routineCatalogId: "",
      order: routineFields.length,
      exercises: [],
    });
    setActiveRoutineIndex(routineFields.length);
  };

  const handleRemoveRoutine = (index: number) => {
    removeRoutine(index);
    if (activeRoutineIndex === index) {
      setActiveRoutineIndex(
        routineFields.length > 1 ? Math.max(0, index - 1) : null,
      );
    } else if (activeRoutineIndex !== null && activeRoutineIndex > index) {
      setActiveRoutineIndex(activeRoutineIndex - 1);
    }
  };

  const watchedRoutines = form.watch("routines");
  const totalExercises = watchedRoutines.reduce(
    (sum, r) => sum + (r.exercises?.length ?? 0),
    0,
  );

  const activeRoutineCatalog =
    activeRoutineIndex !== null
      ? routineCatalogs.find(
          (rc) =>
            rc.id ===
            form.watch(`routines.${activeRoutineIndex}.routineCatalogId`),
        )
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col border-2 border-purple/15 shadow-2xl overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="relative pb-5 border-b-2 border-purple/10 bg-gradient-to-br from-white via-purple/3 to-magent/5 p-6 shrink-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-magent/12 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <div className="h-1 w-10 bg-gradient-to-r from-purple to-magent rounded-full" />
            <DialogTitle className="text-xl font-bold text-black">
              {initialData
                ? "Editar variación de rutina"
                : "Crear nueva variación de rutina"}
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2 mt-2 ml-[52px]">
            <p className="text-xs text-black-400 font-medium">
              Configura la variación con sus rutinas y ejercicios
            </p>
            {routineFields.length > 0 && (
              <div className="flex gap-1.5">
                <Badge className="bg-purple/10 text-purple border-0 text-[10px] px-2 py-0">
                  {routineFields.length} rutina
                  {routineFields.length !== 1 && "s"}
                </Badge>
                <Badge className="bg-magent/10 text-magent border-0 text-[10px] px-2 py-0">
                  {totalExercises} ejercicio{totalExercises !== 1 && "s"}
                </Badge>
              </div>
            )}
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Info básica */}
            <div className="px-6 pt-4 pb-3 shrink-0">
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black-400 text-sm font-semibold">
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ej: Variación A"
                          className="border-2 border-gray-100 focus:border-purple transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black-400 text-sm font-semibold">
                        Fase
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={String(field.value)}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          className="border-2 border-gray-100 focus:border-purple transition-colors"
                        >
                          {PHASE_OPTIONS.map((phase) => (
                            <SelectItem
                              key={phase.value}
                              value={String(phase.value)}
                            >
                              {phase.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black-400 text-sm font-semibold">
                        Etapa
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={String(field.value)}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          className="border-2 border-gray-100 focus:border-purple transition-colors"
                        >
                          {STAGE_OPTIONS.map((stage) => (
                            <SelectItem
                              key={stage.value}
                              value={String(stage.value)}
                            >
                              {stage.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Two-panel: Rutinas | Ejercicios */}
            <div className="flex-1 min-h-0 flex border-t border-gray-100 mx-6 mt-2">
              {/* Left panel - Rutinas */}
              <div className="w-[280px] shrink-0 border-r border-gray-100 flex flex-col">
                <div className="flex items-center justify-between py-3 pr-3">
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-purple" />
                    <span className="text-xs font-bold text-black uppercase tracking-widest">
                      Rutinas
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRoutine}
                    className="flex items-center gap-1 text-[11px] text-purple hover:text-purple/80 font-semibold px-2 py-1 rounded-md hover:bg-purple/5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Agregar
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1 pr-2 pb-2">
                  {routineFields.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <ListChecks className="w-8 h-8 text-gray-200 mb-2" />
                      <p className="text-xs text-gray-400">No hay rutinas</p>
                    </div>
                  )}

                  {routineFields.map((routineField, rIndex) => {
                    const routineId = form.watch(
                      `routines.${rIndex}.routineCatalogId`,
                    );
                    const catalog = routineCatalogs.find(
                      (rc) => rc.id === routineId,
                    );
                    const exerciseCount =
                      watchedRoutines[rIndex]?.exercises?.length ?? 0;
                    const isActive = activeRoutineIndex === rIndex;

                    return (
                      <div
                        key={routineField.id}
                        className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                          isActive
                            ? "bg-purple/8 border border-purple/20"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                        onClick={() => setActiveRoutineIndex(rIndex)}
                      >
                        <div
                          className={`flex items-center justify-center w-7 h-7 rounded-md shrink-0 ${
                            isActive
                              ? "bg-purple/15 text-purple"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {catalog?.iconUrl ? (
                            <img
                              src={catalog.iconUrl}
                              alt=""
                              className="w-4 h-4 object-contain"
                            />
                          ) : (
                            <span className="text-xs font-bold">
                              {rIndex + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm truncate ${
                              isActive
                                ? "font-semibold text-purple"
                                : "text-gray-700"
                            }`}
                          >
                            {catalog?.title || "Sin seleccionar"}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {exerciseCount} ejercicio
                            {exerciseCount !== 1 && "s"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveRoutine(rIndex);
                          }}
                          className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? "text-purple" : "text-gray-200"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right panel - Ejercicios */}
              <div className="flex-1 flex flex-col min-h-0 pl-4">
                {activeRoutineIndex !== null &&
                activeRoutineIndex < routineFields.length ? (
                  <>
                    {/* Routine config */}
                    <div className="flex items-center gap-3 py-3 shrink-0">
                      <FormField
                        control={form.control}
                        name={`routines.${activeRoutineIndex}.routineCatalogId`}
                        render={({ field }) => (
                          <FormItem className="flex-1 space-y-0">
                            <FormLabel className="text-[10px] text-gray-400 uppercase font-semibold">
                              Rutina del catálogo
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                className="border border-gray-200 focus:border-purple transition-colors"
                              >
                                <SelectItem value="">
                                  Seleccionar rutina...
                                </SelectItem>
                                {routineCatalogs.map((rc) => (
                                  <SelectItem key={rc.id} value={rc.id}>
                                    {rc.title}
                                  </SelectItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`routines.${activeRoutineIndex}.order`}
                        render={({ field }) => (
                          <FormItem className="w-20 space-y-0">
                            <FormLabel className="text-[10px] text-gray-400 uppercase font-semibold">
                              Orden
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={
                                  typeof field.value === "number"
                                    ? field.value
                                    : ""
                                }
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? ""
                                      : Number(e.target.value),
                                  )
                                }
                                className="border border-gray-200 focus:border-purple transition-colors h-9 text-center"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Exercises header */}
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 shrink-0">
                      <Dumbbell className="w-4 h-4 text-magent" />
                      <span className="text-xs font-bold text-black uppercase tracking-widest">
                        Ejercicios
                      </span>
                      {activeRoutineCatalog && (
                        <span className="text-xs text-gray-400">
                          de {activeRoutineCatalog.title}
                        </span>
                      )}
                    </div>

                    {/* Exercises list */}
                    <div className="flex-1 min-h-0 pt-2">
                      <ExercisesPanel
                        key={`exercises-${activeRoutineIndex}`}
                        routineIndex={activeRoutineIndex}
                        control={form.control}
                        exerciseCatalogs={exerciseCatalogs}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                      <ChevronRight className="w-6 h-6 text-gray-200" />
                    </div>
                    <p className="text-sm text-gray-400">
                      {routineFields.length === 0
                        ? "Agrega una rutina para comenzar"
                        : "Selecciona una rutina para ver sus ejercicios"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0 bg-gray-50/50">
              <Button
                type="button"
                variant="outline_magent"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="min-w-[110px] shadow-sm hover:shadow-md transition-all font-semibold"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple to-magent hover:from-purple/90 hover:to-magent/90 min-w-[130px] shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                {isLoading
                  ? "Guardando..."
                  : initialData
                    ? "Actualizar"
                    : "Crear variación"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
