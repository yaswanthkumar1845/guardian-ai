import { cn } from "@/lib/utils";
import { AlertTriangle, Shield, ShieldAlert, Siren, Clock } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'SAFE' | 'CAUTION' | 'DANGER' | 'SOS';
  fusionScore: number;
  summary: string;
}

interface ActivityLogProps {
  entries: LogEntry[];
  className?: string;
}

const iconMap = {
  SAFE: Shield,
  CAUTION: AlertTriangle,
  DANGER: ShieldAlert,
  SOS: Siren,
};

const colorMap = {
  SAFE: 'text-safe bg-safe/10',
  CAUTION: 'text-warning bg-warning/10',
  DANGER: 'text-danger bg-danger/10',
  SOS: 'text-danger bg-danger/20',
};

export function ActivityLog({ entries, className }: ActivityLogProps) {
  return (
    <div className={cn("glass-panel p-6", className)}>
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Activity Log</h3>
        <span className="ml-auto text-sm text-muted-foreground">{entries.length} events</span>
      </div>
      
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No activity yet. Run an analysis to see results.
          </p>
        ) : (
          entries.map((entry, index) => {
            const Icon = iconMap[entry.level];
            return (
              <div 
                key={entry.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border border-border/50 transition-all animate-fade-in",
                  index === 0 && "border-primary/30 bg-primary/5"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn("p-2 rounded-lg", colorMap[entry.level])}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-sm font-semibold",
                      entry.level === 'SAFE' ? 'text-safe' :
                      entry.level === 'CAUTION' ? 'text-warning' : 'text-danger'
                    )}>
                      {entry.level}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      Score: {entry.fusionScore.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{entry.summary}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
