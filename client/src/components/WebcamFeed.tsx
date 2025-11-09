import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Camera, Play, Square } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useWebcam } from "@/hooks/useWebcam";
import { apiRequest } from "@/lib/queryClient";

interface WebcamFeedProps {
  onEmotionDetected?: (emotion: string, confidence: number) => void;
}

export default function WebcamFeed({ onEmotionDetected }: WebcamFeedProps) {
  const { videoRef, isActive, error, startWebcam, stopWebcam, captureFrame } = useWebcam();
  const [currentEmotion, setCurrentEmotion] = useState("Neutral");
  const [confidence, setConfidence] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysisIntervalRef = useRef<NodeJS.Timeout>();

  const analyzeEmotion = async () => {
    if (isAnalyzing) return;
    
    const frame = captureFrame();
    if (!frame) {
      console.log("No frame available for analysis");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/emotions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: frame }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Emotion detected:", data);
        setCurrentEmotion(data.emotion);
        setConfidence(data.confidence);
        onEmotionDetected?.(data.emotion, data.confidence);
      } else {
        console.error("Emotion analysis failed:", response.status);
      }
    } catch (err) {
      console.error("Failed to analyze emotion:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (isActive) {
      // Analyze emotion every 8 seconds (to stay under rate limits)
      analysisIntervalRef.current = setInterval(analyzeEmotion, 8000);
      // Immediate first analysis after 2 second delay
      setTimeout(analyzeEmotion, 2000);
    } else {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    }

    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, [isActive]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs uppercase font-medium text-muted-foreground tracking-wider">
          Live Camera Feed
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <Badge className="bg-primary text-primary-foreground">
              <span className="w-2 h-2 bg-primary-foreground rounded-full mr-2 animate-pulse" />
              LIVE
            </Badge>
          )}
          <Button
            size="sm"
            variant={isActive ? "destructive" : "default"}
            onClick={isActive ? stopWebcam : startWebcam}
            data-testid="button-toggle-camera"
          >
            {isActive ? (
              <>
                <Square className="w-3 h-3 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-2" />
                Start Camera
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border-2 border-primary/20">
        {/* Always render video element so it can load */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${!isActive ? 'hidden' : ''}`}
        />

        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-2 opacity-20" />
              <p className="text-sm text-muted-foreground">Click "Start Camera" to begin emotion detection</p>
            </div>
          </div>
        )}

        {isActive && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary rounded-lg" 
               style={{ boxShadow: '0 0 20px rgba(236, 0, 140, 0.3)' }}>
          </div>
        )}
      </div>

      {isActive && (
        <div className="mt-4 bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold">
                  {currentEmotion || "Detecting..."}
                </div>
                <div className="text-xs text-muted-foreground">
                  {confidence > 0 ? `Confidence: ${confidence}%` : "Initializing..."}
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs font-mono">
              {isAnalyzing ? "Analyzing..." : confidence > 0 ? "Ready" : "Starting..."}
            </Badge>
          </div>
        </div>
      )}
    </Card>
  );
}
