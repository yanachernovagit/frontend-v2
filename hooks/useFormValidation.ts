import { useForm, UseFormReturn, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/**
 * Hook personalizado para manejar formularios con validación Zod
 * Wrapper alrededor de react-hook-form con configuración optimizada
 */
export function useFormValidation<T extends FieldValues>(
  schema: z.ZodTypeAny,
  defaultValues?: Partial<T>,
): UseFormReturn<T> {
  return useForm<T>({
    resolver: zodResolver(schema as any) as any,
    defaultValues: defaultValues as any,
    mode: "onChange", // Valida mientras el usuario escribe
    reValidateMode: "onChange", // Re-valida en cada cambio
  });
}

/**
 * Hook para formularios que solo validan al enviar
 * Útil para formularios simples donde la validación en tiempo real puede ser molesta
 */
export function useFormValidationOnSubmit<T extends FieldValues>(
  schema: z.ZodTypeAny,
  defaultValues?: Partial<T>,
): UseFormReturn<T> {
  return useForm<T>({
    resolver: zodResolver(schema as any) as any,
    defaultValues: defaultValues as any,
    mode: "onSubmit",
    reValidateMode: "onChange", // Después del primer submit, valida en tiempo real
  });
}
