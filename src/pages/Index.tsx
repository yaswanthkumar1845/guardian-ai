import { useState, useEffect } from "react";
import { Eye, Volume2 } from "lucide-react";
import { Header } from "@/components/Header";
import { SensorCard } from "@/components/SensorCard";
import { ThreatStatus } from "@/components/ThreatStatus";
import { GPSContext } from "@/components/GPSContext";
import { SensorSimulator } from "@/components/SensorSimulator";
import { FusionMeter } from "@/components/FusionMeter";
import { ActivityLog } from "@/components/ActivityLog";
import { useThreatAnalysis } from "@/hooks/useThreatAnalysis";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { analyze, isLoading, latestAnalysis, currentSensorData, activityLog } = useThreatAnalysis();

  useEffect(() => {
    // Simulate connection
    const timer = setTimeout(() => setIsConnected(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const displayData = currentSensorData || {
    vision_score: 0.15,
    audio_score: 0.1,
    gps_context: {
      latitude: 28.6139,
      longitude: 77.209,
      location_type: "residential",
      time_of_day: "evening",
    },
  };

  const fusionScore = displayData.vision_score + displayData.audio_score;

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <Header isConnected={isConnected} className="animate-fade-in" />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Sensors */}
            <div className="space-y-6 animate-fade-in-delay-1">
              <SensorCard
                title="Vision Agent"
                value={displayData.vision_score}
                icon={Eye}
                description="YOLOv8 pose detection for falls and struggles"
              />
              <SensorCard
                title="Audio Agent"
                value={displayData.audio_score}
                icon={Volume2}
                description="Librosa frequency analysis for distress sounds"
              />
              <GPSContext
                latitude={displayData.gps_context.latitude}
                longitude={displayData.gps_context.longitude}
                locationType={displayData.gps_context.location_type}
                timeOfDay={displayData.gps_context.time_of_day}
              />
            </div>

            {/* Center Column - Status & Fusion */}
            <div className="space-y-6 animate-fade-in-delay-2">
              <ThreatStatus
                level={latestAnalysis?.threat_level || "SAFE"}
                confidence={latestAnalysis?.confidence || 0.95}
                reasoning={latestAnalysis?.reasoning || "System initialized. Awaiting sensor input for threat analysis."}
                recommendedAction={latestAnalysis?.recommended_action || "Continue normal monitoring operations."}
              />
              <FusionMeter fusionScore={fusionScore} />
              <ActivityLog entries={activityLog} />
            </div>

            {/* Right Column - Simulator */}
            <div className="animate-fade-in-delay-3">
              <SensorSimulator
                onAnalyze={analyze}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center py-6 text-sm text-muted-foreground">
            <p>Project Sahayak • Multi-Modal AI Safety Agent • Powered by Gemini AI</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;
