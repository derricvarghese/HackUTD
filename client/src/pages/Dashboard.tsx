import DashboardHeader from "@/components/DashboardHeader";
import HappinessGauge from "@/components/HappinessGauge";
import WebcamFeed from "@/components/WebcamFeed";
import EmotionDistribution from "@/components/EmotionDistribution";
import MetricCard from "@/components/MetricCard";
import GeminiInsights from "@/components/GeminiInsights";
import AlertsList from "@/components/AlertsList";
import TrendChart from "@/components/TrendChart";
import FeedbackInput from "@/components/FeedbackInput";
import { Users, Clock, TrendingUp, Signal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [happinessScore, setHappinessScore] = useState(75);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const { lastMessage } = useWebSocket("/ws");

  // Fetch happiness score
  const { data: scoreData } = useQuery<{ score: number; totalInteractions: number }>({
    queryKey: ["/api/happiness-score"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch emotion stats
  const { data: statsData } = useQuery<Array<{ emotion: string; count: number; percentage: number }>>({
    queryKey: ["/api/emotions/stats"],
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (scoreData) {
      setHappinessScore(scoreData.score);
      setTotalInteractions(scoreData.totalInteractions);
    }
  }, [scoreData]);

  // Update UI from WebSocket messages
  useEffect(() => {
    if (lastMessage?.type === "emotion") {
      // Trigger refetch of stats when new emotion detected
      // queryClient.invalidateQueries({ queryKey: ["/api/emotions/stats"] });
    }
  }, [lastMessage]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top Row - Live Camera Feed and Distribution */}
          <div className="lg:col-span-4">
            <WebcamFeed />
          </div>
          
          <div className="lg:col-span-5">
            <EmotionDistribution data={statsData?.map((stat: any) => ({
              emotion: stat.emotion,
              percentage: stat.percentage,
              color: getEmotionColor(stat.emotion),
              icon: getEmotionIcon(stat.emotion),
            }))} />
          </div>
          
          <div className="lg:col-span-3">
            <AlertsList />
          </div>

          {/* Second Row - Happiness Index and AI Insights */}
          <div className="lg:col-span-4">
            <HappinessGauge score={happinessScore} />
          </div>
          
          <div className="lg:col-span-8">
            <GeminiInsights />
          </div>

          {/* Third Row - Detailed Metrics */}
          <div className="lg:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                label="Total Interactions"
                value={totalInteractions}
                trend={12}
                icon={<Users className="w-4 h-4" />}
              />
              <MetricCard
                label="Avg Response Time"
                value="2.3"
                suffix="sec"
                trend={-8}
                icon={<Clock className="w-4 h-4" />}
              />
              <MetricCard
                label="Satisfaction Rate"
                value={happinessScore}
                suffix="%"
                trend={5}
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <MetricCard
                label="Network Quality"
                value="98"
                suffix="%"
                trend={2}
                icon={<Signal className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Fourth Row - Trends and Feedback */}
          <div className="lg:col-span-8">
            <TrendChart title="24-Hour Sentiment Trends" />
          </div>
          
          <div className="lg:col-span-4">
            <FeedbackInput />
          </div>
        </div>
      </main>
    </div>
  );
}

function getEmotionColor(emotion: string): string {
  const colors: Record<string, string> = {
    Happy: "hsl(var(--chart-5))",
    Delighted: "hsl(var(--primary))",
    Neutral: "hsl(var(--chart-2))",
    Frustrated: "hsl(var(--chart-4))",
    Angry: "hsl(var(--destructive))",
  };
  return colors[emotion] || "hsl(var(--chart-2))";
}

function getEmotionIcon(emotion: string): React.ReactNode {
  // Icons will be imported in EmotionDistribution component
  return null;
}
