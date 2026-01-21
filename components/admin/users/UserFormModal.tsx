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
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AdminUser } from "@/types";
import { USER_ROLES } from "@/constants/UserRoles";

const userSchema = z.object({
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.USER]),
});

type FormValues = z.infer<typeof userSchema>;

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { role: string }) => Promise<void>;
  initialData: AdminUser | null;
  isLoading?: boolean;
}

export function UserFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: UserFormModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: USER_ROLES.USER,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        role:
          initialData.role === USER_ROLES.ADMIN
            ? USER_ROLES.ADMIN
            : USER_ROLES.USER,
      });
    } else {
      form.reset({
        role: USER_ROLES.USER,
      });
    }
  }, [initialData, form, open]);

  const handleSubmit = async (values: FormValues) => {
    await onSubmit({ role: values.role });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-2 border-purple/15 shadow-2xl">
        <DialogHeader className="relative pb-5 border-b-2 border-purple/10 bg-gradient-to-br from-white via-purple/3 to-magent/5 -m-6 mb-0 p-6 rounded-t-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-magent/12 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <div className="h-1 w-10 bg-gradient-to-r from-purple to-magent rounded-full" />
            <DialogTitle className="text-xl font-bold text-black">
              Actualizar rol de usuario
            </DialogTitle>
          </div>
          <p className="text-xs text-black-400 mt-2 font-medium ml-[52px]">
            Modifica el rol del usuario en el sistema
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
                  Información del usuario
                </h3>
              </div>
              <div className="p-4 rounded-xl bg-white border-2 border-purple/15 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple via-magent to-purple shadow-md border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                    {initialData?.email?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">
                      {initialData?.fullName ?? "Usuario"}
                    </p>
                    <p className="text-xs text-black-400 font-medium">
                      {initialData?.email ?? "email@ejemplo.com"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-purple/3 to-magent/4 border border-purple/15">
              <div className="flex items-center gap-2.5 pb-1">
                <div className="w-1 h-5 bg-gradient-to-b from-purple to-magent rounded-full" />
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                  Permisos
                </h3>
              </div>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black-400 text-sm font-semibold">
                      Rol del usuario
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectItem value={USER_ROLES.ADMIN}>
                          Administrador
                        </SelectItem>
                        <SelectItem value={USER_ROLES.USER}>Usuario</SelectItem>
                      </Select>
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
                {isLoading ? "Guardando..." : "Actualizar rol"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
