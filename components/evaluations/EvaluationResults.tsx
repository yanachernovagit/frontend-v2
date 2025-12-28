"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCommonUtils } from "@/hooks/useCommonUtils";

type Props = {
  expectedResults: Record<string, any>;
  inputValues: Record<string, string>;
  onInputChange: (key: string, value: string) => void;
  onSubmit: () => void;
};

export const EvaluationResults = ({
  expectedResults,
  inputValues,
  onInputChange,
  onSubmit,
}: Props) => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { formatNumericValue } = useCommonUtils();

  const expectedResultEntries = Object.entries(expectedResults);

  if (expectedResultEntries.length === 0) {
    return null;
  }

  const allInputsFilled = expectedResultEntries.every(([key]) => {
    const value = inputValues[key];
    return typeof value === "string" && value.trim().length > 0;
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl p-6 w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">
          Registro de resultados
        </h2>
        <p className="text-base text-gray-600">
          Ingresa los valores solicitados
        </p>
      </div>

      {/* Inputs */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-4">
        {expectedResultEntries.map(([key, value]) => {
          const isFocused = focusedInput === key;
          const hasValue = inputValues[key] && inputValues[key].length > 0;

          return (
            <div key={key} className="flex flex-col gap-2 w-full">
              <label className="text-base font-medium text-gray-700">
                {value}
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
                value={inputValues[key] || ""}
                onChange={(e) => {
                  const formattedValue = formatNumericValue(e.target.value);
                  onInputChange(key, formattedValue);
                }}
                onFocus={() => setFocusedInput(key)}
                onBlur={() => setFocusedInput(null)}
                aria-label={value}
              />
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <Button
        onClick={allInputsFilled ? onSubmit : () => {}}
        disabled={!allInputsFilled}
        className={`w-full mt-4 py-6 ${allInputsFilled ? "bg-purple hover:bg-purple/90" : "bg-gray-400"}`}
      >
        <span className="text-white font-bold text-xl">Aceptar</span>
      </Button>
    </div>
  );
};
