"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RenameMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentKey?: string | null;
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function RenameMediaDialog({
  open,
  onOpenChange,
  currentKey,
  value,
  onChange,
  onConfirm,
  isLoading = false,
}: RenameMediaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border border-purple/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <DialogHeader className="relative pb-5 border-b border-purple/15 bg-gradient-to-br from-white via-purple/4 to-magent/6 -m-6 mb-6 p-6 rounded-t-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-magent/15 to-transparent rounded-full blur-3xl pointer-events-none" />
          <DialogTitle className="text-lg font-bold text-black">
            Renombrar archivo
          </DialogTitle>
          <p className="text-xs text-black-400 mt-2 font-medium">
            Edita el nombre para mantener el orden del bucket.
          </p>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-black-300 font-semibold">
              Archivo actual
            </p>
            <p className="text-sm text-black-500 break-all">
              {currentKey ?? "-"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-black-400">
              Nuevo nombre
            </label>
            <Input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="ej: video-introduccion.mp4"
              className="border-2 border-gray-100 focus:border-purple transition-colors"
              disabled={isLoading}
            />
            <p className="text-xs text-black-300">
              Conserva la extensión si quieres mantener el formato.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-5 border-t border-purple/10">
          <Button
            type="button"
            variant="outline_magent"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple to-magent hover:from-purple/90 hover:to-magent/90 min-w-[130px] shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            {isLoading ? "Guardando..." : "Renombrar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
