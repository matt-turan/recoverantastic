'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../ui/chart';

const chartData = [
  { date: 'Mon', mood: 5 },
  { date: 'Tue', mood: 6 },
  { date: 'Wed', mood: 7 },
  { date: 'Thu', mood: 6 },
  { date: 'Fri', mood: 8 },
  { date: 'Sat', mood: 9 },
  { date: 'Sun', mood: 7 },
];

const chartConfig = {
  mood: {
    label: 'Mood',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Weekly Progress</CardTitle>
        <CardDescription>Mood tracking over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} accessibilityLayer>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                domain={[0, 10]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="mood" fill="var(--color-mood)" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
