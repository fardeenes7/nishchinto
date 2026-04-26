"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/ui/chart";

const chartConfig = {
  signup_count: {
    label: "Signups",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function CohortChart({ data }: { data: any[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <LineChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="cohort_month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line 
          type="monotone" 
          dataKey="signup_count" 
          stroke="var(--color-signup_count)" 
          strokeWidth={2} 
          dot={true} 
        />
      </LineChart>
    </ChartContainer>
  );
}
