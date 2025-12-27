import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const sensorData: SensorData = await req.json();
    console.log("Received sensor data:", JSON.stringify(sensorData));

    // Multi-modal fusion calculation
    const fusionScore = sensorData.vision_score + sensorData.audio_score;
    const highConfidenceScream = sensorData.audio_score > 0.8;
    
    // Determine initial threat level based on fusion logic
    let initialThreatLevel: string;
    if (fusionScore > 1.2 || highConfidenceScream) {
      initialThreatLevel = "SOS - Immediate danger detected";
    } else if (fusionScore > 0.8) {
      initialThreatLevel = "DANGER - High risk situation";
    } else if (fusionScore > 0.5) {
      initialThreatLevel = "CAUTION - Monitor closely";
    } else {
      initialThreatLevel = "SAFE - No immediate threats";
    }

    // Use Gemini for cognitive reasoning
    const systemPrompt = `You are an AI safety agent analyzing multi-modal sensor data for threat detection.
Your role is to provide a final safety assessment based on:
- Vision Score (0-1): Detects falls, struggles, or dangerous postures
- Audio Score (0-1): Detects screams, distress calls, or abnormal sounds
- GPS Context: Location type and time of day

Respond with a JSON object containing:
- threat_level: One of "SAFE", "CAUTION", "DANGER", or "SOS"
- confidence: A number between 0 and 1
- reasoning: A brief explanation (2-3 sentences max)
- recommended_action: What should be done immediately

Be decisive and prioritize user safety. When in doubt, escalate.`;

    const userPrompt = `Analyze this sensor data:
- Vision Score: ${sensorData.vision_score.toFixed(2)} (${sensorData.vision_score > 0.6 ? "Fall/struggle detected" : "Normal posture"})
- Audio Score: ${sensorData.audio_score.toFixed(2)} (${sensorData.audio_score > 0.7 ? "Distress sounds detected" : "Normal audio"})
- Location: ${sensorData.gps_context.location_type} at ${sensorData.gps_context.time_of_day}
- Fusion Score: ${fusionScore.toFixed(2)}
- Initial Assessment: ${initialThreatLevel}

Provide your final threat analysis as JSON.`;

    console.log("Calling Gemini for threat analysis...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please try again shortly." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "AI credits exhausted. Please add credits." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const aiContent = aiResponse.choices?.[0]?.message?.content;
    
    console.log("AI Response:", aiContent);

    let analysisResult: ThreatAnalysis;
    
    try {
      const parsed = JSON.parse(aiContent);
      analysisResult = {
        threat_level: parsed.threat_level || "CAUTION",
        confidence: parsed.confidence || 0.7,
        fusion_score: fusionScore,
        reasoning: parsed.reasoning || "Analysis based on multi-modal sensor fusion.",
        recommended_action: parsed.recommended_action || "Monitor situation closely.",
        timestamp: new Date().toISOString(),
      };
    } catch {
      // Fallback if AI response isn't valid JSON
      console.log("Using fallback analysis due to parsing error");
      analysisResult = {
        threat_level: fusionScore > 1.2 || highConfidenceScream ? "SOS" : 
                      fusionScore > 0.8 ? "DANGER" : 
                      fusionScore > 0.5 ? "CAUTION" : "SAFE",
        confidence: 0.75,
        fusion_score: fusionScore,
        reasoning: `Multi-modal fusion score of ${fusionScore.toFixed(2)} indicates ${fusionScore > 1.0 ? "elevated" : "normal"} risk levels.`,
        recommended_action: fusionScore > 1.0 ? "Initiate emergency protocols" : "Continue monitoring",
        timestamp: new Date().toISOString(),
      };
    }

    console.log("Final analysis:", JSON.stringify(analysisResult));

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in threat-analysis function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
