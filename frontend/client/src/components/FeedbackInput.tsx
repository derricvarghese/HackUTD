import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { useState } from "react";

interface FeedbackItem {
  id: string;
  text: string;
  sentiment: string;
  timestamp: Date;
  aiAnalysis: string;
}

export default function FeedbackInput() {
  const [feedback, setFeedback] = useState("");
  const [recentFeedback, setRecentFeedback] = useState<FeedbackItem[]>([
    {
      id: "1",
      text: "The service was great today, but the wait time was a bit long.",
      sentiment: "Neutral",
      timestamp: new Date(Date.now() - 10 * 60000),
      aiAnalysis: "Mixed sentiment: Positive service experience offset by wait time concerns"
    },
    {
      id: "2",
      text: "Love the new store layout! Much easier to find what I need.",
      sentiment: "Positive",
      timestamp: new Date(Date.now() - 25 * 60000),
      aiAnalysis: "Strong positive sentiment regarding store improvements"
    }
  ]);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    const newFeedback: FeedbackItem = {
      id: Date.now().toString(),
      text: feedback,
      sentiment: "Analyzing...",
      timestamp: new Date(),
      aiAnalysis: "Gemini is analyzing this feedback..."
    };

    setRecentFeedback([newFeedback, ...recentFeedback]);
    setFeedback("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newFeedback.text }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Wait for sentiment analysis to complete
        setTimeout(async () => {
          const feedbackResponse = await fetch(`/api/feedback/recent?limit=10`);
          if (feedbackResponse.ok) {
            const allFeedback = await feedbackResponse.json();
            const analyzed = allFeedback.find((f: any) => f.id === data.id);
            
            if (analyzed) {
              setRecentFeedback(prev =>
                prev.map(item =>
                  item.id === newFeedback.id
                    ? { 
                        ...item, 
                        sentiment: analyzed.sentiment || "Neutral",
                        aiAnalysis: `Gemini analysis: ${analyzed.sentiment || "Neutral"} sentiment detected`
                      }
                    : item
                )
              );
            }
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  const getSentimentColor = (sentiment: string): "default" | "secondary" | "destructive" | "outline" => {
    if (sentiment.includes("Positive")) return "secondary";
    if (sentiment.includes("Negative")) return "destructive";
    return "default";
  };

  return (
    <Card className="p-6">
      <div className="text-xs uppercase font-medium text-muted-foreground tracking-wider mb-4">
        Customer Feedback
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Enter customer feedback to analyze with Gemini..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-24 resize-none"
            data-testid="input-feedback"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {feedback.length} / 500
            </span>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!feedback.trim()}
              data-testid="button-submit-feedback"
            >
              <Send className="w-3 h-3 mr-2" />
              Submit
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="text-xs font-medium text-muted-foreground mb-3">
            Recent Feedback
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentFeedback.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-border bg-card hover-elevate"
              >
                <div className="flex items-start gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm flex-1">{item.text}</p>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <p className="text-xs text-muted-foreground flex-1">{item.aiAnalysis}</p>
                </div>
                <div className="flex items-center justify-between mt-2 ml-6">
                  <Badge variant={getSentimentColor(item.sentiment)} className="text-xs">
                    {item.sentiment}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
