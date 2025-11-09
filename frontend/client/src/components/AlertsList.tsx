import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

interface Alert {
  id: string;
  message: string;
  severity: "critical" | "warning" | "info";
  timestamp: Date;
}

export default function AlertsList() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      message: "Negative sentiment spike detected: 23% increase in frustrated customers",
      severity: "critical",
      timestamp: new Date(Date.now() - 5 * 60000)
    },
    {
      id: "2",
      message: "Network quality correlation: Happiness score dropped 12% during service outage",
      severity: "warning",
      timestamp: new Date(Date.now() - 15 * 60000)
    },
    {
      id: "3",
      message: "Daily happiness goal achieved: 85% positive sentiment maintained",
      severity: "info",
      timestamp: new Date(Date.now() - 45 * 60000)
    }
  ]);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "default";
      case "info":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive/10";
      case "warning":
        return "bg-primary/10";
      case "info":
        return "bg-muted";
      default:
        return "bg-muted";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs uppercase font-medium text-muted-foreground tracking-wider">
          Active Alerts
        </div>
        <Badge variant="outline" className="text-xs">
          {alerts.length} Active
        </Badge>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No active alerts
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getSeverityBg(alert.severity)}`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-4 h-4 mt-0.5 ${
                  alert.severity === 'critical' ? 'text-destructive' :
                  alert.severity === 'warning' ? 'text-primary' :
                  'text-muted-foreground'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                      {alert.severity}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => dismissAlert(alert.id)}
                      data-testid={`button-dismiss-${alert.id}`}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm leading-relaxed mb-2">
                    {alert.message}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {alert.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
