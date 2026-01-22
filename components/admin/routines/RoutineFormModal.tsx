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
import { Button } from "@/components/ui/button";
import { RoutineCatalog } from "@/types";
import { MediaUploadField } from "@/components/admin/media/MediaUploadField";

const routineSchema = z.object({
  title: z.string().min(1, "El titulo es requerido"),
  order: z.number().min(0),
  iconUrl: z.string().url().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof routineSchema>;

interface RoutineFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<RoutineCatalog>) => Promise<void>;
  initialData: RoutineCatalog | null;
  isLoading?: boolean;
}

function normalizeUrl(value?: string) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function RoutineFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: RoutineFormModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      title: "",
      order: 0,
      iconUrl: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        order: initialData.order,
        iconUrl: initialData.iconUrl || "",
      });
    } else {
      form.reset({
        title: "",
        order: 0,
        iconUrl: "",
      });
    }
  }, [initialData, form, open]);

  const handleSubmit = async (values: FormValues) => {
    await onSubmit({
      ...values,
      iconUrl: normalizeUrl(values.iconUrl),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-purple/15 shadow-2xl">
        <DialogHeader className="relative pb-5 border-b-2 border-purple/10 bg-gradient-to-br from-white via-purple/3 to-magent/5 -m-6 mb-0 p-6 rounded-t-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-magent/12 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <div className="h-1 w-10 bg-gradient-to-r from-purple to-magent rounded-full" />
            <DialogTitle className="text-xl font-bold text-black">
              {initialData ? "Editar rutina" : "Crear nueva rutina"}
            </DialogTitle>
          </div>
          <p className="text-xs text-black-400 mt-2 font-medium ml-[52px]">
            Completa la información de la rutina
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
              <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
              <div className="flex items-center gap-2.5 pb-1">
                <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                  Recursos visuales
                </h3>
              </div>
              <FormField
                control={form.control}
                name="iconUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-400 text-sm font-semibold">
                      URL de icono
                    </FormLabel>
                    <MediaUploadField
                      accept="image/*"
                      folder="routines/icons"
                      disabled={isLoading}
                      onUploaded={(url) =>
                        form.setValue("iconUrl", url, {
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
                    : "Crear rutina"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
