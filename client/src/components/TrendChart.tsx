import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TrendChartProps {
  title: string;
  data?: any[];
}

export default function TrendChart({ title, data }: TrendChartProps) {
  // Mock data for the last 24 hours
  const defaultData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    happiness: Math.floor(65 + Math.random() * 25),
    positive: Math.floor(40 + Math.random() * 30),
    negative: Math.floor(5 + Math.random() * 15),
  }));

  const chartData = data || defaultData;

  return (
    <Card className="p-6">
      <div className="text-xs uppercase font-medium text-muted-foreground tracking-wider mb-6">
        {title}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              fontSize: "12px",
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="happiness"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            name="Happiness Score"
          />
          <Line
            type="monotone"
            dataKey="positive"
            stroke="hsl(var(--chart-5))"
            strokeWidth={2}
            dot={false}
            name="Positive Emotions"
          />
          <Line
            type="monotone"
            dataKey="negative"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            dot={false}
            name="Negative Emotions"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
