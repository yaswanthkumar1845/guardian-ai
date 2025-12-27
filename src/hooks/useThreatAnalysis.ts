import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SensorData {
  vision_score: number;
  audio_score: number;
  gps_context: {
    latitude: number;
    longitude: number;
    location_type: string;
    time_of_day: string;
  };
}

interface ThreatAnalysis {
  threat_level: 'SAFE' | 'CAUTION' | 'DANGER' | 'SOS';
  confidence: number;
  fusion_score: number;
  reasoning: string;
  recommended_action: string;
  timestamp: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'SAFE' | 'CAUTION' | 'DANGER' | 'SOS';
  fusionScore: number;
  summary: string;
}

export function useThreatAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState<ThreatAnalysis | null>(null);
  const [currentSensorData, setCurrentSensorData] = useState<SensorData | null>(null);
  const [activityLog, setActivityLog] = useState<LogEntry[]>([]);
  const { toast } = useToast();

  const analyze = useCallback(async (sensorData: SensorData) => {
    setIsLoading(true);
    setCurrentSensorData(sensorData);

    try {
      const { data, error } = await supabase.functions.invoke('threat-analysis', {
        body: sensorData,
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const analysis = data as ThreatAnalysis;
      setLatestAnalysis(analysis);

      // Add to activity log
      const logEntry: LogEntry = {
        id: crypto.randomUUID(),
        timestamp: analysis.timestamp,
        level: analysis.threat_level,
        fusionScore: analysis.fusion_score,
        summary: analysis.reasoning.substring(0, 100),
      };

      setActivityLog(prev => [logEntry, ...prev.slice(0, 19)]);

      // Show toast based on threat level
      if (analysis.threat_level === 'SOS') {
        toast({
          variant: "destructive",
          title: "🚨 EMERGENCY SOS TRIGGERED",
          description: analysis.recommended_action,
        });
      } else if (analysis.threat_level === 'DANGER') {
        toast({
          variant: "destructive",
          title: "⚠️ Danger Detected",
          description: analysis.reasoning,
        });
      } else if (analysis.threat_level === 'CAUTION') {
        toast({
          title: "⚡ Caution Advised",
          description: analysis.reasoning,
        });
      } else {
        toast({
          title: "✅ All Clear",
          description: "No threats detected in the area.",
        });
      }

      return analysis;
    } catch (error) {
      console.error("Threat analysis error:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze threat data",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    analyze,
    isLoading,
    latestAnalysis,
    currentSensorData,
    activityLog,
  };
}
