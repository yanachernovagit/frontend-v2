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
import { Badge } from "@/components/ui/badge";
import { NotificationTemplate } from "@/types";

const templateSchema = z.object({
  title: z.string().min(1, "El titulo es obligatorio"),
  body: z.string().min(1, "El mensaje es obligatorio"),
  enabled: z.boolean(),
});

type FormValues = z.infer<typeof templateSchema>;

const variableHints: Record<string, string> = {
  exercise_reminder: "Sin variables disponibles",
  streak_milestone: "Variables: {days}",
  inactivity_reminder: "Variables: {days}",
  weekly_summary: "Variables: {completed}, {total}",
  phase_change: "Sin variables disponibles",
  evaluation_reminder: "Sin variables disponibles",
};

interface TemplateFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => Promise<void>;
  initialData: NotificationTemplate | null;
  isLoading?: boolean;
}

export function TemplateFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: TemplateFormModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: "",
      body: "",
      enabled: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        body: initialData.body,
        enabled: initialData.enabled,
      });
    } else {
      form.reset({
        title: "",
        body: "",
        enabled: true,
      });
    }
  }, [initialData, form, open]);

  const handleSubmit = async (values: FormValues) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-2 border-purple/15 shadow-2xl">
        <DialogHeader className="relative pb-5 border-b-2 border-purple/10 bg-gradient-to-br from-white via-purple/3 to-magent/5 -m-6 mb-0 p-6 rounded-t-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-magent/12 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <div className="h-1 w-10 bg-gradient-to-r from-purple to-magent rounded-full" />
            <DialogTitle className="text-xl font-bold text-black">
              Editar plantilla
            </DialogTitle>
          </div>
          <p className="text-xs text-black-400 mt-2 font-medium ml-[52px]">
            Modifica el contenido de la plantilla de notificación
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
                  Tipo de notificación
                </h3>
              </div>
              <div className="p-4 rounded-xl bg-white border-2 border-purple/15 shadow-sm">
                <Badge className="bg-purple/10 text-purple border border-purple/20 font-semibold">
                  {initialData?.type ?? "-"}
                </Badge>
              </div>
            </div>

            <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
              <div className="flex items-center gap-2.5 pb-1">
                <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                  Contenido
                </h3>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-400 text-sm font-semibold">
                      Titulo
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-400 text-sm font-semibold">
                      Mensaje
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    {initialData?.type && variableHints[initialData.type] && (
                      <p className="text-xs text-gray-500 mt-1">
                        {variableHints[initialData.type]}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-purple/15 p-4 bg-white">
                    <FormLabel className="text-black-400 text-sm font-semibold">
                      Activo
                    </FormLabel>
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
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
