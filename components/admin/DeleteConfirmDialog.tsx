"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md border border-red-500/25 shadow-[0_25px_50px_-12px_rgba(239,68,68,0.25)]">
        <AlertDialogHeader className="relative pb-5 border-b border-red-500/20 bg-gradient-to-br from-white via-red-500/5 to-red-500/8 -m-6 mb-4 p-6 rounded-t-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-500/12 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex items-start gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/25 blur-lg rounded-xl" />
              <div className="relative p-3 rounded-xl bg-red-500/12 border border-red-500/30 shadow-[0_4px_12px_0_rgba(239,68,68,0.15)]">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <div className="flex-1 space-y-2 pt-0.5 relative z-10">
              <AlertDialogTitle className="text-lg font-bold text-black drop-shadow-sm">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-black-400 leading-relaxed font-medium">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 mt-4 -mb-6 -mx-6 px-6 pb-6 pt-5 bg-gradient-to-br from-red-500/4 to-red-500/8 border-t border-red-500/15 rounded-b-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-500/12 to-transparent rounded-full blur-2xl pointer-events-none" />
          <AlertDialogCancel
            disabled={isLoading}
            className="border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.1)] transition-all font-semibold relative z-10"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white min-w-[130px] shadow-[0_4px_12px_0_rgba(239,68,68,0.3)] hover:shadow-[0_6px_20px_0_rgba(239,68,68,0.4)] transition-all font-bold border border-white/20 relative z-10"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
