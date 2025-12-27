import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Play, RotateCcw, Zap, AlertCircle } from "lucide-react";

interface SensorSimulatorProps {
  onAnalyze: (data: {
    vision_score: number;
    audio_score: number;
    gps_context: {
      latitude: number;
      longitude: number;
      location_type: string;
      time_of_day: string;
    };
  }) => void;
  isLoading: boolean;
  className?: string;
}

const scenarios = [
  { name: "Normal Activity", vision: 0.15, audio: 0.1 },
  { name: "Suspicious Movement", vision: 0.55, audio: 0.3 },
  { name: "Fall Detected", vision: 0.85, audio: 0.4 },
  { name: "Scream Detected", vision: 0.2, audio: 0.9 },
  { name: "Full Emergency", vision: 0.9, audio: 0.95 },
];

export function SensorSimulator({ onAnalyze, isLoading, className }: SensorSimulatorProps) {
  const [visionScore, setVisionScore] = useState(0.15);
  const [audioScore, setAudioScore] = useState(0.1);
  const [locationType, setLocationType] = useState("residential");
  const [timeOfDay, setTimeOfDay] = useState("evening");

  const handleScenario = (scenario: typeof scenarios[0]) => {
    setVisionScore(scenario.vision);
    setAudioScore(scenario.audio);
  };

  const handleReset = () => {
    setVisionScore(0.15);
    setAudioScore(0.1);
  };

  const handleAnalyze = () => {
    onAnalyze({
      vision_score: visionScore,
      audio_score: audioScore,
      gps_context: {
        latitude: 28.6139 + (Math.random() - 0.5) * 0.1,
        longitude: 77.209 + (Math.random() - 0.5) * 0.1,
        location_type: locationType,
        time_of_day: timeOfDay,
      },
    });
  };

  const fusionScore = visionScore + audioScore;

  return (
    <div className={cn("glass-panel p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Sensor Simulator</h3>
          <p className="text-sm text-muted-foreground">Simulate multi-modal input data</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Scenarios */}
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground mb-3">Quick Scenarios</p>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((scenario) => (
            <Button
              key={scenario.name}
              variant="outline"
              size="sm"
              onClick={() => handleScenario(scenario)}
              className="text-xs"
            >
              {scenario.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Manual Controls */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Vision Score (YOLO)</label>
            <span className="font-mono text-sm text-muted-foreground">{visionScore.toFixed(2)}</span>
          </div>
          <Slider
            value={[visionScore]}
            onValueChange={([v]) => setVisionScore(v)}
            max={1}
            step={0.01}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Audio Score (Scream)</label>
            <span className="font-mono text-sm text-muted-foreground">{audioScore.toFixed(2)}</span>
          </div>
          <Slider
            value={[audioScore]}
            onValueChange={([v]) => setAudioScore(v)}
            max={1}
            step={0.01}
            className="cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location Type</label>
            <Select value={locationType} onValueChange={setLocationType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="isolated">Isolated Area</SelectItem>
                <SelectItem value="public">Public Space</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time of Day</label>
            <Select value={timeOfDay} onValueChange={setTimeOfDay}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Fusion Score Preview */}
      <div className={cn(
        "mt-6 p-4 rounded-xl border transition-all",
        fusionScore > 1.2 ? "bg-danger/10 border-danger/30" :
        fusionScore > 0.8 ? "bg-warning/10 border-warning/30" : "bg-muted/50 border-border"
      )}>
        <div className="flex items-center gap-3">
          {fusionScore > 1.0 && <AlertCircle className={cn(
            "w-5 h-5",
            fusionScore > 1.2 ? "text-danger" : "text-warning"
          )} />}
          <div>
            <p className="text-sm text-muted-foreground">Fusion Score</p>
            <p className={cn(
              "text-2xl font-mono font-bold",
              fusionScore > 1.2 ? "text-danger" :
              fusionScore > 0.8 ? "text-warning" : "text-safe"
            )}>
              {fusionScore.toFixed(2)}
            </p>
          </div>
          <p className="ml-auto text-sm text-muted-foreground">
            {fusionScore > 1.2 ? "SOS Threshold Exceeded" :
             fusionScore > 0.8 ? "Elevated Risk" : "Normal Range"}
          </p>
        </div>
      </div>

      {/* Analyze Button */}
      <Button 
        onClick={handleAnalyze} 
        disabled={isLoading}
        className="w-full mt-6 gradient-primary text-foreground font-semibold h-12"
      >
        {isLoading ? (
          <>
            <Zap className="w-5 h-5 mr-2 animate-pulse" />
            Analyzing with Gemini AI...
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Run Threat Analysis
          </>
        )}
      </Button>
    </div>
  );
}
