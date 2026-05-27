"use client";

import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  visible: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (operationDate: Date) => void | Promise<void>;
};

function toISODateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function OperationDateModal({
  visible,
  isSubmitting,
  onClose,
  onConfirm,
}: Props) {
  const [operationDate, setOperationDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const maxDate = useMemo(() => toISODateString(new Date()), []);
  const selectedDateText = operationDate || "Selecciona una fecha";

  const handleConfirm = async () => {
    if (!operationDate) {
      setError("Selecciona una fecha.");
      return;
    }

    const parsed = new Date(`${operationDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      setError("La fecha ingresada no es valida.");
      return;
    }

    setError(null);
    await onConfirm(parsed);
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={() => {
          setOperationDate("");
          setError(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Fecha de operacion</DialogTitle>
          <DialogDescription>
            Ingresa la fecha de tu operacion.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="relative">
            <Input
              id="operation-date"
              type="date"
              min="1900-01-01"
              max={maxDate}
              value={operationDate}
              disabled={isSubmitting}
              onChange={(e) => {
                setOperationDate(e.target.value);
                setError(null);
              }}
              className={`h-11 ${error ? "border-red-400" : "border-gray-200"}`}
            />
          </div>
          {!operationDate ? (
            <p className="text-sm text-gray-600">{selectedDateText}</p>
          ) : null}
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </div>

        <Button
          type="button"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="w-full bg-purple text-white hover:bg-purple/90"
        >
          {isSubmitting ? "Guardando..." : "Confirmar"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
