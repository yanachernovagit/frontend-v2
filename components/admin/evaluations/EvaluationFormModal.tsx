"use client";

import { useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Evaluation } from "@/types";
import { MediaUploadField } from "@/components/admin/media/MediaUploadField";

const evaluationSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripcion es requerida"),
  howToDo: z.string().min(1, "Las instrucciones son requeridas"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal("")),
  isTime: z.boolean(),
  seconds: z.number().min(0).optional(),
  order: z.number().min(0),
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
      isTime: false,
      seconds: 0,
      order: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        howToDo: initialData.howToDo,
        imageUrl: initialData.imageUrl || "",
        logoUrl: initialData.logoUrl || "",
        videoUrl: initialData.videoUrl || "",
        isTime: initialData.isTime,
        seconds: initialData.seconds || 0,
        order: initialData.order,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        howToDo: "",
        imageUrl: "",
        logoUrl: "",
        videoUrl: "",
        isTime: false,
        seconds: 0,
        order: 0,
      });
    }
  }, [initialData, form, open]);

  const handleSubmit = async (values: FormValues) => {
    await onSubmit({
      ...values,
      imageUrl: normalizeUrl(values.imageUrl),
      logoUrl: normalizeUrl(values.logoUrl),
      videoUrl: normalizeUrl(values.videoUrl),
      seconds: values.isTime ? (values.seconds ?? 0) : undefined,
    });
  };

  const isTimeEnabled = form.watch("isTime");

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
              <div className="grid grid-cols-2 gap-4">
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
                  Configuración de tiempo
                </h3>
              </div>
              <div className="flex items-start gap-6">
                <FormField
                  control={form.control}
                  name="isTime"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0 p-3.5 border-2 border-gray-100 rounded-xl hover:border-purple/20 transition-colors">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 cursor-pointer text-black-400 text-sm font-semibold">
                        Es evaluación de tiempo
                      </FormLabel>
                    </FormItem>
                  )}
                />

                {isTimeEnabled && (
                  <FormField
                    control={form.control}
                    name="seconds"
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                )}
              </div>
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
