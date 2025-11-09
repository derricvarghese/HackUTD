import { Card } from "@/components/ui/card";

interface HappinessGaugeProps {
  score: number;
}

export default function HappinessGauge({ score }: HappinessGaugeProps) {
  const rotation = (score / 100) * 180 - 90;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "hsl(var(--chart-5))";
    if (score >= 60) return "hsl(var(--chart-4))";
    if (score >= 40) return "hsl(var(--chart-2))";
    return "hsl(var(--destructive))";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Attention";
  };

  return (
    <Card className="p-6 flex flex-col items-center justify-center">
      <div className="text-xs uppercase font-medium text-muted-foreground tracking-wider mb-4">
        Happiness Index
      </div>
      
      <div className="relative w-48 h-24 mb-4">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <path
            d="M 10 90 A 90 90 0 0 1 190 90"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="20"
            strokeLinecap="round"
          />
          
          <path
            d="M 10 90 A 90 90 0 0 1 190 90"
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 283} 283`}
            className="transition-all duration-1000"
          />
          
          <line
            x1="100"
            y1="90"
            x2="100"
            y2="30"
            stroke={getScoreColor(score)}
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${rotation} 100 90)`}
            className="transition-transform duration-700"
          />
          
          <circle cx="100" cy="90" r="8" fill={getScoreColor(score)} />
        </svg>
      </div>

      <div className="text-5xl font-semibold font-mono mb-2" style={{ color: getScoreColor(score) }}>
        {score}
      </div>
      
      <div className="text-sm font-medium text-muted-foreground">
        {getScoreLabel(score)}
      </div>
    </Card>
  );
}
