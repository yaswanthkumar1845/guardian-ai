import { cn } from "@/lib/utils";

interface FusionMeterProps {
  fusionScore: number;
  className?: string;
}

export function FusionMeter({ fusionScore, className }: FusionMeterProps) {
  const percentage = Math.min((fusionScore / 2) * 100, 100);
  const sosThreshold = (1.2 / 2) * 100;
  const dangerThreshold = (0.8 / 2) * 100;
  
  const getColor = () => {
    if (fusionScore > 1.2) return 'danger';
    if (fusionScore > 0.8) return 'warning';
    return 'safe';
  };
  
  const color = getColor();

  return (
    <div className={cn("glass-panel p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Multi-Modal Fusion
          </p>
          <p className={cn(
            "text-4xl font-mono font-bold mt-1",
            color === 'danger' ? 'text-danger' :
            color === 'warning' ? 'text-warning' : 'text-safe'
          )}>
            {fusionScore.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">SOS Threshold</p>
          <p className="text-lg font-mono font-semibold text-danger">1.20</p>
        </div>
      </div>
      
      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
        {/* Threshold markers */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-warning/50 z-10"
          style={{ left: `${dangerThreshold}%` }}
        />
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-danger z-10"
          style={{ left: `${sosThreshold}%` }}
        />
        
        {/* Fill bar */}
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500",
            color === 'danger' ? 'gradient-danger' :
            color === 'warning' ? 'gradient-warning' : 'gradient-safe'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>0.00</span>
        <span className="text-warning">CAUTION 0.80</span>
        <span className="text-danger">SOS 1.20</span>
        <span>2.00</span>
      </div>
    </div>
  );
}
