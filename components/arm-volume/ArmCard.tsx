"use client";

import { Input } from "@/components/ui/input";

const POINTS = [
  { num: 1, label: "A", sublabel: "axila" },
  { num: 2, label: "B", sublabel: null },
  { num: 3, label: "C", sublabel: "codo" },
  { num: 4, label: "D", sublabel: null },
  { num: 5, label: "E", sublabel: null },
  { num: 6, label: "F", sublabel: "muñeca" },
];

export function ArmCard({
  arm,
  inputValues,
  focusedInput,
  onInputChange,
  onFocus,
  onBlur,
}: {
  arm: "left" | "right";
  inputValues: Record<string, string>;
  focusedInput: string | null;
  onInputChange: (key: string, value: string) => void;
  onFocus: (key: string) => void;
  onBlur: () => void;
}) {
  const armLabel = arm === "left" ? "izquierdo" : "derecho";
  return (
    <div className="bg-purple rounded-2xl p-3 sm:p-5 flex flex-col gap-3 sm:gap-4">
      <h3 className="text-magent font-bold text-base sm:text-lg text-center leading-tight">
        Brazo {armLabel}
        <span className="block text-white/60 text-xs sm:text-sm font-normal">
          circunferencia (cm)
        </span>
      </h3>
      <div className="flex flex-col gap-2 sm:gap-3">
        {POINTS.map(({ num, label, sublabel }) => {
          const key = `${arm}_${num}`;
          const isFocused = focusedInput === key;
          const hasValue = inputValues[key]?.length > 0;
          return (
            <div
              key={key}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
            >
              <span className="text-white text-xs font-medium sm:w-44 sm:shrink-0">
                Punto {label}
                {sublabel ? (
                  <>
                    {" "}
                    — <strong>{sublabel}</strong>
                  </>
                ) : null}{" "}
                (cm)
              </span>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="0.0"
                value={inputValues[key] ?? ""}
                onChange={(e) => onInputChange(key, e.target.value)}
                onFocus={() => onFocus(key)}
                onBlur={onBlur}
                aria-label={`Brazo ${armLabel} punto ${label}`}
                className={`w-full text-center font-semibold text-purple bg-white rounded-xl h-8 sm:h-10 border-2 focus-visible:ring-0 transition-colors ${
                  isFocused
                    ? "border-magent"
                    : hasValue
                      ? "border-white/60"
                      : "border-white/20"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
