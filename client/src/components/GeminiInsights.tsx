import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface Insight {
  type: "finding" | "recommendation" | "alert";
  title: string;
  description: string;
  priority?: "high" | "medium" | "low";
}

export default function GeminiInsights() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: insights = [], isLoading } = useQuery<Insight[]>({
    queryKey: ["/api/insights"],
    refetchInterval: 60000, // Refresh every minute
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["/api/insights"] });
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "finding":
        return <TrendingUp className="w-4 h-4" />;
      case "recommendation":
        return <Lightbulb className="w-4 h-4" />;
      case "alert":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <div className="text-sm font-semibold">AI-Generated Insights</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Powered by Gemini
          </Badge>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleRefresh}
            disabled={isRefreshing}
            data-testid="button-refresh-insights"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-border bg-card hover-elevate"
          >
            <div className="flex items-start gap-3">
              <div className="text-primary mt-1">{getIcon(insight.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold">{insight.title}</h4>
                  {insight.priority && (
                    <Badge variant={getPriorityColor(insight.priority)} className="text-xs">
                      {insight.priority}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <span>Auto-refresh: 5 min</span>
        </div>
      </div>
    </Card>
  );
}
