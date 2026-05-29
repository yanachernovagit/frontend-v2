"use client";

import { useMemo } from "react";

import type { ProfileQuestion } from "@/types";

type Props = {
  question: ProfileQuestion;
  value: string;
  onValueChange: (questionId: string, value: string) => void;
  onAnswered?: (questionId: string) => void;
};

function formatDateISO(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function QuestionRenderer({
  question,
  value,
  onValueChange,
  onAnswered,
}: Props) {
  const minDate = "1900-01-01";
  const maxDate = useMemo(() => formatDateISO(new Date()), []);

  const formattedDate = useMemo(() => {
    if (!value) return "Seleccionar fecha";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "Seleccionar fecha";
    return date.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [value]);

  return (
    <div className="mb-6">
      <label className="mb-2 block text-base font-semibold text-gray-700">
        {question.title}
        {question.isRequired ? <span className="text-red-500"> *</span> : null}
      </label>

      {question.type === "multiple" ? (
        <div className="flex flex-col gap-3">
          {question.options?.map((option) => {
            const optionValue = String(option);
            const isSelected = value === optionValue;

            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => {
                  onValueChange(question.id, optionValue);
                  onAnswered?.(question.id);
                }}
                className={`flex min-h-[60px] items-center rounded-xl border-2 p-4 transition-colors ${
                  isSelected
                    ? "border-magent bg-magent-200/35"
                    : "border-gray-200 bg-white"
                }`}
                role="radio"
                aria-checked={isSelected}
              >
                <span className="mr-4">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? "border-magent bg-magent"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected ? (
                      <span className="h-4 w-4 rounded-full bg-white" />
                    ) : null}
                  </span>
                </span>
                <span
                  className={`flex-1 text-left text-base ${
                    isSelected
                      ? "font-semibold text-magent"
                      : "font-normal text-gray-700"
                  }`}
                >
                  {optionValue}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {question.type === "open" ? (
        <textarea
          value={value}
          onChange={(e) => onValueChange(question.id, e.target.value)}
          onBlur={() => onAnswered?.(question.id)}
          rows={4}
          className="min-h-[120px] w-full rounded-xl border-2 border-gray-200 bg-white p-4 text-base text-gray-900 outline-none focus:border-magent"
          placeholder="Escribe tu respuesta..."
        />
      ) : null}

      {question.type === "date" ? (
        <div>
          <input
            type="date"
            value={value}
            min={minDate}
            max={maxDate}
            onChange={(e) => {
              onValueChange(question.id, e.target.value);
              onAnswered?.(question.id);
            }}
            onBlur={() => onAnswered?.(question.id)}
            className="min-h-[52px] w-full rounded-xl border-2 border-gray-200 bg-white p-4 text-base text-gray-900 outline-none focus:border-magent"
            aria-label={`Seleccionar fecha para ${question.title}`}
          />
          <p
            className={`mt-2 text-sm ${
              value ? "text-gray-700" : "text-gray-400"
            }`}
          >
            {formattedDate}
          </p>
        </div>
      ) : null}

      {question.type === "number" ? (
        <input
          type="text"
          value={value}
          onChange={(e) =>
            onValueChange(question.id, e.target.value.replace(/[^0-9.,-]/g, ""))
          }
          onBlur={() => onAnswered?.(question.id)}
          inputMode="decimal"
          className="min-h-[52px] w-full rounded-xl border-2 border-gray-200 bg-white p-4 text-base text-gray-900 outline-none focus:border-magent"
          placeholder="Ingresa un número"
        />
      ) : null}
    </div>
  );
}
