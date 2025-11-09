import { Card } from "@/components/ui/card";
import { Smile, Meh, Frown, Angry, Sparkles } from "lucide-react";

interface EmotionData {
  emotion: string;
  percentage: number;
  color: string;
  icon: React.ReactNode;
}

interface EmotionDistributionProps {
  data?: EmotionData[];
}

export default function EmotionDistribution({ data }: EmotionDistributionProps) {
  // Mock data
  const defaultData: EmotionData[] = [
    { emotion: "Happy", percentage: 45, color: "hsl(var(--chart-5))", icon: <Smile className="w-4 h-4" /> },
    { emotion: "Delighted", percentage: 23, color: "hsl(var(--primary))", icon: <Sparkles className="w-4 h-4" /> },
    { emotion: "Neutral", percentage: 20, color: "hsl(var(--chart-2))", icon: <Meh className="w-4 h-4" /> },
    { emotion: "Frustrated", percentage: 8, color: "hsl(var(--chart-4))", icon: <Frown className="w-4 h-4" /> },
    { emotion: "Angry", percentage: 4, color: "hsl(var(--destructive))", icon: <Angry className="w-4 h-4" /> },
  ];

  const emotionData = data || defaultData;

  return (
    <Card className="p-6">
      <div className="text-xs uppercase font-medium text-muted-foreground tracking-wider mb-4">
        Emotion Distribution
      </div>

      <div className="space-y-3">
        {emotionData.map((item) => (
          <div key={item.emotion}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div style={{ color: item.color }}>{item.icon}</div>
                <span className="text-sm font-medium">{item.emotion}</span>
              </div>
              <span className="text-sm font-mono font-semibold" style={{ color: item.color }}>
                {item.percentage}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
