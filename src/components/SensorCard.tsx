import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SensorCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  className?: string;
}

const getStatusFromValue = (value: number) => {
  if (value > 0.7) return 'danger';
  if (value > 0.4) return 'warning';
  return 'safe';
};

const getGlowClass = (status: string) => {
  switch (status) {
    case 'danger': return 'pulse-danger';
    case 'warning': return 'pulse-warning';
    default: return 'pulse-safe';
  }
};

const getValueColor = (status: string) => {
  switch (status) {
    case 'danger': return 'text-danger';
    case 'warning': return 'text-warning';
    default: return 'text-safe';
  }
};

const getIconBg = (status: string) => {
  switch (status) {
    case 'danger': return 'bg-danger/20 text-danger';
    case 'warning': return 'bg-warning/20 text-warning';
    default: return 'bg-safe/20 text-safe';
  }
};

export function SensorCard({ title, value, icon: Icon, description, className }: SensorCardProps) {
  const status = getStatusFromValue(value);
  
  return (
    <div className={cn(
      "threat-card group",
      getGlowClass(status),
      className
    )}>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl transition-all duration-300",
            getIconBg(status)
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={cn(
            "status-indicator",
            `status-${status}`
          )} />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className={cn("sensor-value", getValueColor(status))}>
            {(value * 100).toFixed(0)}%
          </p>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              status === 'danger' ? 'gradient-danger' :
              status === 'warning' ? 'gradient-warning' : 'gradient-safe'
            )}
            style={{ width: `${value * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
