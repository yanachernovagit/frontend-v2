"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Switch } from "@/components/ui/switch";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProfileQuestion } from "@/types";

const questionSchema = z.object({
  title: z.string().min(1, "El titulo es requerido"),
  type: z.enum(["multiple", "date", "open", "number"]),
  optionsText: z.string().optional(),
  isActive: z.boolean(),
  isRequired: z.boolean(),
  order: z.number().min(0),
  step: z.number().min(0),
  dependsOnQuestionId: z.string().optional().or(z.literal("")),
  dependsOnValue: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof questionSchema>;

interface QuestionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<ProfileQuestion>) => Promise<void>;
  initialData: ProfileQuestion | null;
  questions: ProfileQuestion[];
  isLoading?: boolean;
}

function parseOptions(value?: string) {
  if (!value) return [];
  return value
    .split(",")
    .map((option) => option.trim())
    .filter((option) => option.length > 0);
}

export function QuestionFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  questions,
  isLoading = false,
}: QuestionFormModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: "",
      type: "open",
      optionsText: "",
      isActive: true,
      isRequired: true,
      order: 0,
      step: 0,
      dependsOnQuestionId: "",
      dependsOnValue: "",
    },
  });

  const dependencyOptions = useMemo(() => {
    return questions.filter((question) => question.id !== initialData?.id);
  }, [questions, initialData]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        type: initialData.type,
        optionsText: (initialData.options || []).join(", "),
        isActive: initialData.isActive,
        isRequired: initialData.isRequired,
        order: initialData.order,
        step: initialData.step,
        dependsOnQuestionId: initialData.dependsOnQuestionId || "",
        dependsOnValue: initialData.dependsOnValue || "",
      });
    } else {
      form.reset({
        title: "",
        type: "open",
        optionsText: "",
        isActive: true,
        isRequired: true,
        order: 0,
        step: 0,
        dependsOnQuestionId: "",
        dependsOnValue: "",
      });
    }
  }, [initialData, form, open]);

  const handleSubmit = async (values: FormValues) => {
    await onSubmit({
      title: values.title,
      type: values.type,
      options: parseOptions(values.optionsText),
      isActive: values.isActive,
      isRequired: values.isRequired,
      order: values.order,
      step: values.step,
      dependsOnQuestionId: values.dependsOnQuestionId || null,
      dependsOnValue: values.dependsOnValue || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-purple/15 shadow-2xl">
        <DialogHeader className="relative pb-5 border-b-2 border-purple/10 bg-gradient-to-br from-white via-purple/3 to-magent/5 -m-6 mb-0 p-6 rounded-t-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-magent/12 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <div className="h-1 w-10 bg-gradient-to-r from-purple to-magent rounded-full" />
            <DialogTitle className="text-xl font-bold text-black">
              {initialData ? "Editar pregunta" : "Crear nueva pregunta"}
            </DialogTitle>
          </div>
          <p className="text-xs text-black-400 mt-2 font-medium ml-[52px]">
            Completa la información de la pregunta de perfil
          </p>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5 pt-4"
          >
            <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
              <div className="flex items-center gap-2.5 pb-1">
                <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                  Información básica
                </h3>
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-400 text-sm font-semibold">
                      Título
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

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black-400 text-sm font-semibold">
                        Tipo
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectItem value="multiple">Múltiple</SelectItem>
                          <SelectItem value="date">Fecha</SelectItem>
                          <SelectItem value="open">Abierta</SelectItem>
                          <SelectItem value="number">Número</SelectItem>
                        </Select>
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

                <FormField
                  control={form.control}
                  name="step"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black-400 text-sm font-semibold">
                        Paso
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
                name="optionsText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-400 text-sm font-semibold">
                      Opciones (separadas por coma)
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

            <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
              <div className="flex items-center gap-2.5 pb-1">
                <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                  Estado y validación
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border-2 border-gray-100 p-4 hover:border-purple/20 transition-colors">
                      <div>
                        <FormLabel className="text-black-400 text-sm font-semibold cursor-pointer">
                          Activa
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isRequired"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border-2 border-gray-100 p-4 hover:border-purple/20 transition-colors">
                      <div>
                        <FormLabel className="text-black-400 text-sm font-semibold cursor-pointer">
                          Requerida
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
              <div className="flex items-center gap-2.5 pb-1">
                <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                  Dependencias
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dependsOnQuestionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black-400 text-sm font-semibold">
                        Depende de
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectItem value="">Sin dependencia</SelectItem>
                          {dependencyOptions.map((question) => (
                            <SelectItem key={question.id} value={question.id}>
                              {question.title}
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
                  name="dependsOnValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black-400 text-sm font-semibold">
                        Valor dependiente
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
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t-2 border-purple/10 bg-gradient-to-br from-purple/3 to-magent/5 -mb-6 -mx-6 px-6 pb-6 rounded-b-xl">
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
                    : "Crear pregunta"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
