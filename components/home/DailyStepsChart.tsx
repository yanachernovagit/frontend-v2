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

interface DailySteps {
  day: string;
  steps: number;
}

export function DailyStepsChart() {
  const dailyStepsData: DailySteps[] = [
    { day: "Lun", steps: 8500 },
    { day: "Mar", steps: 12000 },
    { day: "Mié", steps: 7200 },
    { day: "Jue", steps: 15000 },
    { day: "Vie", steps: 10500 },
    { day: "Sáb", steps: 6800 },
    { day: "Dom", steps: 9200 },
    { day: "Lun", steps: 11500 },
    { day: "Mar", steps: 13000 },
    { day: "Mié", steps: 14200 },
  ];

  const chartConfig = {
    steps: {
      label: "Pasos",
      color: "#EB449C",
    },
  };

  const averageSteps = Math.round(
    dailyStepsData.reduce((acc, d) => acc + d.steps, 0) / dailyStepsData.length,
  );

  return (
    <Card className="p-4 flex flex-col bg-bg-secondary rounded-xl min-h-[300px] shrink-0">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700">
          Pasos diarios - Últimos 10 días
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Promedio: {averageSteps.toLocaleString()} pasos/día
        </p>
      </div>
      <ChartContainer
        config={chartConfig}
        className="flex-1 min-h-0 w-full aspect-auto"
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
    </Card>
  );
}
