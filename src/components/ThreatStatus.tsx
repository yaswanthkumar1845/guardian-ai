import { cn } from "@/lib/utils";
import { AlertTriangle, Shield, ShieldAlert, Siren } from "lucide-react";

interface ThreatStatusProps {
  level: 'SAFE' | 'CAUTION' | 'DANGER' | 'SOS';
  confidence: number;
  reasoning: string;
  recommendedAction: string;
  className?: string;
}

const statusConfig = {
  SAFE: {
    icon: Shield,
    label: 'All Clear',
    color: 'text-safe',
    bg: 'bg-safe/10',
    border: 'border-safe/30',
    glow: 'glow-safe',
  },
  CAUTION: {
    icon: AlertTriangle,
    label: 'Caution',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    glow: 'glow-warning',
  },
  DANGER: {
    icon: ShieldAlert,
    label: 'Danger',
    color: 'text-danger',
    bg: 'bg-danger/10',
    border: 'border-danger/30',
    glow: 'glow-danger',
  },
  SOS: {
    icon: Siren,
    label: 'EMERGENCY SOS',
    color: 'text-danger',
    bg: 'bg-danger/20',
    border: 'border-danger/50',
    glow: 'pulse-danger',
  },
};

export function ThreatStatus({ level, confidence, reasoning, recommendedAction, className }: ThreatStatusProps) {
  const config = statusConfig[level];
  const Icon = config.icon;
  
  return (
    <div className={cn(
      "glass-panel p-6 border-2 transition-all duration-500",
      config.bg,
      config.border,
      config.glow,
      className
    )}>
      <div className="flex items-center gap-4 mb-6">
        <div className={cn(
          "p-4 rounded-2xl",
          config.bg
        )}>
          <Icon className={cn("w-10 h-10", config.color)} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
            Threat Status
          </p>
          <h2 className={cn("text-3xl font-bold", config.color)}>
            {config.label}
          </h2>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm text-muted-foreground">Confidence</p>
          <p className={cn("text-2xl font-mono font-bold", config.color)}>
            {(confidence * 100).toFixed(0)}%
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="glass-panel p-4 bg-background/50">
          <p className="text-sm font-medium text-muted-foreground mb-2">AI Analysis</p>
          <p className="text-foreground">{reasoning}</p>
        </div>
        
        <div className={cn(
          "p-4 rounded-xl border",
          level === 'SOS' || level === 'DANGER' ? 'bg-danger/10 border-danger/30' : 'bg-muted/50 border-border'
        )}>
          <p className="text-sm font-medium text-muted-foreground mb-2">Recommended Action</p>
          <p className={cn(
            "font-medium",
            level === 'SOS' || level === 'DANGER' ? 'text-danger' : 'text-foreground'
          )}>
            {recommendedAction}
          </p>
        </div>
      </div>
    </div>
  );
}
