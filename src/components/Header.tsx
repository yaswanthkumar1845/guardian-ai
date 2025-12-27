import { Shield, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isConnected: boolean;
  className?: string;
}

export function Header({ isConnected, className }: HeaderProps) {
  return (
    <header className={cn(
      "glass-panel px-6 py-4 flex items-center justify-between",
      className
    )}>
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-xl gradient-primary">
          <Shield className="w-8 h-8 text-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Project Sahayak</h1>
          <p className="text-sm text-muted-foreground">Multi-Modal AI Safety Agent</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Gemini 2.5 Flash</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={cn(
            "status-indicator",
            isConnected ? "status-safe" : "status-danger"
          )} />
          <span className="text-sm font-medium">
            {isConnected ? "System Online" : "Connecting..."}
          </span>
        </div>
      </div>
    </header>
  );
}
