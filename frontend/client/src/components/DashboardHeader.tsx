import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Settings, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import tmobileLogo from "@/assets/tmobile.png"; // <-- Added import

export default function DashboardHeader() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleExport = () => {
    console.log('Export report triggered');
  };

  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div>
            <img
             src={tmobileLogo}
             alt="T-Mobile Logo"
             className="w-14 h-14"
          />
          </div>
          <div>
            <h1 className="text-lg font-semibold">CareSense</h1>
            <p className="text-xs text-muted-foreground">Real-time monitoring</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge className="bg-primary text-primary-foreground">
          <span className="w-2 h-2 bg-primary-foreground rounded-full mr-2 animate-pulse" />
          LIVE
        </Badge>
        
        <div className="text-sm text-muted-foreground font-mono">
          {currentTime.toLocaleTimeString()}
        </div>

        <div className="h-6 w-px bg-border" />

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setDarkMode(!darkMode)}
          data-testid="button-theme-toggle"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleExport}
          data-testid="button-export"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>

        <Button size="icon" variant="ghost" data-testid="button-settings">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
