"use client";

import { useState } from "react";
import {
  Brain,
  BarChart3,
  CalendarDays,
  Activity,
  Save,
  RefreshCw,
  Info,
  Sparkles,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAI } from "@/hooks/useAdminAI";
import { AIConfig } from "@/types";

type EditableConfig = Omit<AIConfig, "provider" | "model">;

const EMPTY_FORM: EditableConfig = {
  temperature: "",
  maxBaselinePercent: "",
  fatigueHighReduction: "",
  fatigueMediumReduction: "",
  fatigueLowIncrease: "",
  setsRange: "",
  repsRange: "",
  weightIncrement: "",
  durationIncrement: "",
};

const toEditableConfig = (cfg: AIConfig): EditableConfig => ({
  temperature: cfg.temperature,
  maxBaselinePercent: cfg.maxBaselinePercent,
  fatigueHighReduction: cfg.fatigueHighReduction,
  fatigueMediumReduction: cfg.fatigueMediumReduction,
  fatigueLowIncrease: cfg.fatigueLowIncrease,
  setsRange: cfg.setsRange,
  repsRange: cfg.repsRange,
  weightIncrement: cfg.weightIncrement,
  durationIncrement: cfg.durationIncrement,
});

const configFields: {
  key: keyof EditableConfig;
  label: string;
  description: string;
  placeholder: string;
  type: "number" | "range";
}[] = [
  {
    key: "temperature",
    label: "Temperatura",
    description:
      "Controla la creatividad de la IA (0 = determinístico, 1 = creativo)",
    placeholder: "0.3",
    type: "number",
  },
  {
    key: "maxBaselinePercent",
    label: "Máximo sobre baseline (%)",
    description:
      "Porcentaje máximo que la IA puede prescribir sobre la línea base del ejercicio",
    placeholder: "130",
    type: "number",
  },
  {
    key: "fatigueHighReduction",
    label: "Fatiga alta: reducción (%)",
    description: "Rango de reducción cuando el paciente reporta fatiga alta",
    placeholder: "20-40",
    type: "range",
  },
  {
    key: "fatigueMediumReduction",
    label: "Fatiga media: reducción (%)",
    description: "Rango de reducción cuando el paciente reporta fatiga media",
    placeholder: "5-15",
    type: "range",
  },
  {
    key: "fatigueLowIncrease",
    label: "Fatiga baja: aumento (%)",
    description: "Rango de aumento cuando el paciente reporta fatiga baja",
    placeholder: "0-10",
    type: "range",
  },
  {
    key: "setsRange",
    label: "Rango de series",
    description: "Mínimo y máximo de series que la IA puede prescribir",
    placeholder: "1-5",
    type: "range",
  },
  {
    key: "repsRange",
    label: "Rango de repeticiones",
    description: "Mínimo y máximo de repeticiones que la IA puede prescribir",
    placeholder: "1-20",
    type: "range",
  },
  {
    key: "weightIncrement",
    label: "Incremento de peso (gramos)",
    description:
      "Incremento mínimo de peso; los valores se redondean a este múltiplo",
    placeholder: "500",
    type: "number",
  },
  {
    key: "durationIncrement",
    label: "Incremento de duración (segundos)",
    description:
      "Incremento mínimo de duración; los valores se redondean a este múltiplo",
    placeholder: "5",
    type: "number",
  },
];

export default function AdminAIPage() {
  const {
    config,
    stats,
    loading,
    saving,
    error,
    saveSuccess,
    updateConfig,
    refetchConfig,
    refetchStats,
  } = useAdminAI();

  const [draft, setDraft] = useState<Partial<EditableConfig>>({});
  const baseForm = config ? toEditableConfig(config) : EMPTY_FORM;
  const form: EditableConfig = { ...baseForm, ...draft };

  const handleFieldChange = (key: keyof EditableConfig, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = (): string | null => {
    const temp = parseFloat(form.temperature);
    if (isNaN(temp) || temp < 0 || temp > 2) {
      return "La temperatura debe ser un numero entre 0 y 2.";
    }
    const maxBaseline = parseInt(form.maxBaselinePercent);
    if (isNaN(maxBaseline) || maxBaseline < 100 || maxBaseline > 300) {
      return "El maximo sobre baseline debe estar entre 100 y 300.";
    }
    const rangePattern = /^\d+-\d+$/;
    const rangeFields: { key: keyof EditableConfig; label: string }[] = [
      { key: "fatigueHighReduction", label: "Fatiga alta" },
      { key: "fatigueMediumReduction", label: "Fatiga media" },
      { key: "fatigueLowIncrease", label: "Fatiga baja" },
      { key: "setsRange", label: "Rango de sets" },
      { key: "repsRange", label: "Rango de reps" },
    ];
    for (const { key, label } of rangeFields) {
      if (!rangePattern.test(form[key].trim())) {
        return `${label} debe tener formato "min-max" (ej: "5-15").`;
      }
    }
    const weight = parseInt(form.weightIncrement);
    if (isNaN(weight) || weight < 0) {
      return "El incremento de peso debe ser un numero positivo.";
    }
    const duration = parseInt(form.durationIncrement);
    if (isNaN(duration) || duration < 0) {
      return "El incremento de duracion debe ser un numero positivo.";
    }
    return null;
  };

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSave = async () => {
    const err = validateForm();
    if (err) {
      setValidationError(err);
      setTimeout(() => setValidationError(null), 5000);
      return;
    }
    setValidationError(null);
    try {
      await updateConfig(form);
      setDraft({});
    } catch {
      // error is handled by the hook
    }
  };

  const isDirty =
    config !== null &&
    Object.keys(form).some(
      (key) =>
        form[key as keyof EditableConfig] !==
        config[key as keyof EditableConfig],
    );

  // Prepare chart data from stats
  const chartData = stats?.last7Days
    ? Object.values(
        stats.last7Days.reduce(
          (acc, item) => {
            const dateKey = item.date;
            if (!acc[dateKey]) {
              acc[dateKey] = { date: dateKey, ai: 0, static: 0, fallback: 0 };
            }
            const source = item.source as "ai" | "static" | "fallback";
            if (source in acc[dateKey]) {
              acc[dateKey][source] += item.count;
            }
            return acc;
          },
          {} as Record<
            string,
            { date: string; ai: number; static: number; fallback: number }
          >,
        ),
      ).sort((a, b) => a.date.localeCompare(b.date))
    : [];

  // Format dates for chart
  const formattedChartData = chartData.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
    }),
  }));

  const sourceColorMap: Record<string, string> = {
    ai: "bg-purple/10 text-purple border-purple/20",
    static: "bg-blue-100 text-blue-700 border-blue-200",
    fallback: "bg-amber-100 text-amber-700 border-amber-200",
  };

  const sourceLabel: Record<string, string> = {
    ai: "IA",
    static: "Estático",
    fallback: "Fallback",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-5 p-7 rounded-2xl bg-gradient-to-br from-white via-purple/5 to-magent/8 border border-purple/20 transition-all duration-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-magent/12 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2 rounded-lg bg-purple/10">
            <Brain className="w-6 h-6 text-purple" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black tracking-tight">
              Inteligencia Artificial
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Configura el sistema de prescripción con IA
            </p>
          </div>
        </div>
        <Button
          variant="outline_magent"
          size="sm"
          onClick={() => {
            setDraft({});
            refetchConfig();
            refetchStats();
          }}
          disabled={loading}
          className="font-semibold"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border bg-red-50 border-red-200 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-purple/5 to-magent/8 border border-purple/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple/10">
                <BarChart3 className="w-5 h-5 text-purple" />
              </div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Total prescripciones
              </span>
            </div>
            <p className="text-3xl font-bold text-black">{stats.total}</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-purple/5 to-magent/8 border border-purple/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <CalendarDays className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Hoy
              </span>
            </div>
            <p className="text-3xl font-bold text-black">{stats.today}</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-purple/5 to-magent/8 border border-purple/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Por fuente
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {stats.bySource &&
                Object.entries(stats.bySource).map(([source, count]) => (
                  <Badge
                    key={source}
                    className={`${sourceColorMap[source] ?? "bg-gray-100 text-gray-700 border-gray-200"} font-semibold text-xs border`}
                  >
                    {sourceLabel[source] ?? source}: {count}
                  </Badge>
                ))}
              {(!stats.bySource ||
                Object.keys(stats.bySource).length === 0) && (
                <span className="text-sm text-gray-400">Sin datos</span>
              )}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-purple/5 to-magent/8 border border-purple/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple/10">
                <Sparkles className="w-5 h-5 text-purple" />
              </div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Proveedor
              </span>
            </div>
            {config ? (
              <div>
                <p className="text-lg font-bold text-black">
                  {config.provider}
                </p>
                <p className="text-sm text-gray-500">{config.model}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Cargando...</p>
            )}
          </div>
        </div>
      )}

      {/* Chart: Last 7 Days */}
      {formattedChartData.length > 0 && (
        <div className="p-5 rounded-2xl bg-white border border-purple/15">
          <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-4">
            Prescripciones — Últimos 7 días
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="ai"
                  name="IA"
                  fill="#7c3aed"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="static"
                  name="Estático"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="fallback"
                  name="Fallback"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Config Form */}
      <div className="p-6 rounded-2xl bg-white border border-purple/15 space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-6 bg-gradient-to-b from-purple to-magent rounded-full" />
          <h2 className="text-lg font-bold text-black">
            Parámetros del prompt
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {configFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label
                htmlFor={`ai-${field.key}`}
                className="text-sm font-semibold text-gray-700"
              >
                {field.label}
              </Label>
              <Input
                id={`ai-${field.key}`}
                value={form[field.key]}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
              <p className="text-xs text-gray-400">{field.description}</p>
            </div>
          ))}
        </div>

        {/* Info note */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Los cambios se aplican a las prescripciones generadas a partir de
            mañana. Las prescripciones de hoy están cacheadas y no se ven
            afectadas.
          </p>
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-xl border bg-green-50 border-green-200 text-green-700 text-sm font-medium">
            Configuracion guardada correctamente.
          </div>
        )}

        {validationError && (
          <div className="p-4 rounded-xl border bg-red-50 border-red-200 text-red-600 text-sm font-medium">
            {validationError}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving || loading || !isDirty}
            className="bg-gradient-to-r from-purple to-magent hover:from-purple/90 hover:to-magent/90 shadow-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}
