"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useCommonUtils } from "@/hooks/useCommonUtils";

interface ArmVolumeInputProps {
  inputValues: Record<string, string>;
  onInputChange: (key: string, value: string) => void;
}

export function ArmVolumeInput({
  inputValues,
  onInputChange,
}: ArmVolumeInputProps) {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { formatNumericValue } = useCommonUtils();

  const renderInput = (arm: "left" | "right", point: number) => {
    const key = `${arm}_${point}`;
    const isFocused = focusedInput === key;
    const hasValue = inputValues[key] && inputValues[key].length > 0;

    return (
      <div key={key} className="w-[48%] mb-4">
        <label className="text-base font-medium text-gray-700 mb-2 block">
          Punto {point}
        </label>
        <Input
          type="text"
          inputMode="decimal"
          className={`py-4 px-4 text-center text-purple text-xl font-semibold rounded-xl min-h-[56px] ${
            isFocused
              ? "border-2 border-magent ring-0 focus-visible:ring-0"
              : hasValue
                ? "border border-purple"
                : "border border-purple"
          }`}
          placeholder="0.0"
          value={inputValues[key] ?? ""}
          onChange={(e) => {
            const formattedValue = formatNumericValue(e.target.value);
            onInputChange(key, formattedValue);
          }}
          onFocus={() => setFocusedInput(key)}
          onBlur={() => setFocusedInput(null)}
          aria-label={`${arm === "left" ? "Brazo izquierdo" : "Brazo derecho"} punto ${point}`}
        />
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">
          Registro de resultados
        </h2>
        <p className="text-base text-gray-600">
          Ingresa las medidas en centímetros para cada punto
        </p>
      </div>

      {/* Left Arm */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <div className="w-1 h-6 bg-purple rounded-full mr-2" />
          <h3 className="text-xl font-bold text-gray-900">Brazo Izquierdo</h3>
        </div>
        <div className="flex flex-wrap justify-between">
          {[1, 2, 3, 4, 5, 6].map((point) => renderInput("left", point))}
        </div>
      </div>

      {/* Right Arm */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <div className="w-1 h-6 bg-purple rounded-full mr-2" />
          <h3 className="text-xl font-bold text-gray-900">Brazo Derecho</h3>
        </div>
        <div className="flex flex-wrap justify-between">
          {[1, 2, 3, 4, 5, 6].map((point) => renderInput("right", point))}
        </div>
      </div>
    </div>
  );
}
