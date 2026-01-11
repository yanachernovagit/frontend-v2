"use client";

import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useStepsHistory } from "@/hooks/useStepsHistory";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";

interface DailySteps {
  day: string;
  steps: number;
}

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

type Period = "week" | "month" | "3months";

const PERIOD_DAYS: Record<Period, number> = {
  week: 7,
  month: 30,
  "3months": 90,
};

const PERIOD_LABELS: Record<Period, string> = {
  week: "1 Semana",
  month: "1 Mes",
  "3months": "3 Meses",
};

const formatDateToDay = (dateString: string): string => {
  const date = new Date(dateString);
  return DAYS_OF_WEEK[date.getDay()];
};

export function DailyStepsChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");
  const { steps, loading, error } = useStepsHistory(
    PERIOD_DAYS[selectedPeriod],
  );

  const dailyStepsData: DailySteps[] = useMemo(() => {
    return steps.map((step) => ({
      day: formatDateToDay(step.date),
      steps: step.steps,
    }));
  }, [steps]);

  const chartConfig = {
    steps: {
      label: "Pasos",
      color: "#EB449C",
    },
  };

  const averageSteps = useMemo(() => {
    if (dailyStepsData.length === 0) return 0;
    return Math.round(
      dailyStepsData.reduce((acc, d) => acc + d.steps, 0) /
        dailyStepsData.length,
    );
  }, [dailyStepsData]);

  return (
    <Card className="p-4 flex flex-col bg-bg-secondary rounded-xl min-h-[300px] shrink-0">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700">
          Pasos diarios - {PERIOD_LABELS[selectedPeriod]}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Promedio: {averageSteps.toLocaleString()} pasos/día
        </p>
      </div>

      <div className="flex-1 min-h-0 w-full relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary/50 z-10">
            <p className="text-sm text-gray-500">Cargando pasos...</p>
          </div>
        )}
        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary/50 z-10">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}
        {dailyStepsData.length === 0 && !loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary/50 z-10">
            <p className="text-sm text-gray-500">
              No hay datos de pasos disponibles
            </p>
          </div>
        )}
        <ChartContainer
          config={chartConfig}
          className="w-full h-full aspect-auto"
        >
          <BarChart data={dailyStepsData} margin={{ right: 0, left: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              width={30}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="steps"
              fill="var(--color-steps)"
              radius={[8, 8, 0, 0]}
            />
            <ReferenceLine
              y={6000}
              stroke="#2E2EF8"
              strokeDasharray="3 3"
              label={{
                value: "Objetivo: 6k",
                position: "insideTopLeft",
                fill: "#2E2EF8",
                fontSize: 12,
                offset: 10,
              }}
            />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="flex gap-2 mt-4 justify-center">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((period) => (
          <Button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
              selectedPeriod === period
                ? "bg-magent text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {PERIOD_LABELS[period]}
          </Button>
        ))}
      </div>
    </Card>
  );
}
