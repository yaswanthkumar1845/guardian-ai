import { MapPin, Clock, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface GPSContextProps {
  latitude: number;
  longitude: number;
  locationType: string;
  timeOfDay: string;
  className?: string;
}

export function GPSContext({ latitude, longitude, locationType, timeOfDay, className }: GPSContextProps) {
  return (
    <div className={cn("glass-panel p-6", className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-info/20 text-info">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            GPS Context
          </p>
          <p className="text-lg font-semibold">{locationType}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Navigation className="w-3 h-3" /> Latitude
          </p>
          <p className="font-mono text-sm">{latitude.toFixed(4)}°</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Navigation className="w-3 h-3" /> Longitude
          </p>
          <p className="font-mono text-sm">{longitude.toFixed(4)}°</p>
        </div>
        <div className="col-span-2 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3" /> Time Context
          </p>
          <p className="font-medium capitalize">{timeOfDay}</p>
        </div>
      </div>
    </div>
  );
}
