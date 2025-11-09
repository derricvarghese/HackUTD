import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  suffix?: string;
  icon?: React.ReactNode;
}

export default function MetricCard({ label, value, trend, suffix, icon }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs uppercase font-medium text-muted-foreground tracking-wider">
          {label}
        </div>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-2 mb-2">
        <div className="text-3xl font-semibold font-mono">
          {value}
        </div>
        {suffix && (
          <div className="text-lg text-muted-foreground">{suffix}</div>
        )}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {trend > 0 ? (
            <>
              <TrendingUp className="w-3 h-3 text-chart-5" />
              <span className="text-xs font-medium text-chart-5">+{trend}%</span>
            </>
          ) : trend < 0 ? (
            <>
              <TrendingDown className="w-3 h-3 text-destructive" />
              <span className="text-xs font-medium text-destructive">{trend}%</span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">No change</span>
          )}
          <span className="text-xs text-muted-foreground ml-1">vs last hour</span>
        </div>
      )}
    </Card>
  );
}
