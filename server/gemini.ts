import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeImageEmotion(imageBase64: string): Promise<{ emotion: string; confidence: number }> {
  try {
    // Extract base64 data from data URL if needed
    const base64Data = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1]
      : imageBase64;

    if (!base64Data || base64Data.length < 100) {
      console.log("Invalid or empty base64 data received");
      return { emotion: "Neutral", confidence: 50 };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are an expert facial emotion recognition system analyzing a customer's face in real-time.
    
    CRITICAL: Look VERY CAREFULLY at facial features. Be sensitive to subtle expressions.
    
    Analyze these specific facial features:
    - EYEBROWS: Are they raised (surprise/happy), neutral, furrowed/down (angry/frustrated)?
    - EYES: Wide open (delighted), squinted (angry), neutral?
    - MOUTH: Smiling (happy), flat line (neutral), frown/downturned (angry/frustrated)?
    - FOREHEAD: Wrinkled (concerned/angry), smooth (calm)?
    - JAW: Clenched or tense (angry), relaxed (neutral/happy)?
    
    Return ONLY a JSON object with exactly this format (no markdown, no extra text):
    {"emotion": "one of: Happy, Neutral, Frustrated, Angry, Delighted", "confidence": number between 0-100}
    
    Emotion Definitions with SPECIFIC facial cues:
    - Happy: Smile, corners of mouth up, relaxed eyes, raised cheeks
    - Delighted: BIG smile, very happy expression, bright eyes, possibly laughing
    - Neutral: Calm face, no strong expression, mouth flat, relaxed
    - Frustrated: Slight frown, furrowed brow, concerned look, tense expression
    - Angry: Strong frown, eyebrows DOWN and together, clenched jaw, intense eyes, scowling
    
    IMPORTANT: 
    - If you see ANY frowning, furrowed brows, or tense expression → choose Frustrated or Angry
    - If eyebrows are down and together with a frown → DEFINITELY Angry (not Neutral!)
    - Only use Neutral if face is truly calm with no negative expression
    - Be confident in detecting negative emotions - don't default to Neutral
    
    If no clear face is detected, return: {"emotion": "Neutral", "confidence": 50}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text().trim();
    
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[^}]+\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        emotion: parsed.emotion || "Neutral",
        confidence: Math.min(100, Math.max(0, parsed.confidence || 50)),
      };
    }

    return { emotion: "Neutral", confidence: 50 };
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    return { emotion: "Neutral", confidence: 50 };
  }
}

export async function analyzeFeedbackSentiment(text: string): Promise<{ sentiment: string; analysis: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Analyze this customer feedback and provide sentiment analysis.
    Return ONLY a JSON object with this format (no markdown, no extra text):
    {"sentiment": "Positive, Negative, or Mixed", "analysis": "brief one-sentence explanation"}
    
    Customer feedback: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text().trim();
    
    const jsonMatch = responseText.match(/\{[^}]+\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        sentiment: parsed.sentiment || "Neutral",
        analysis: parsed.analysis || "Analysis unavailable",
      };
    }

    return { sentiment: "Neutral", analysis: "Unable to analyze feedback" };
  } catch (error) {
    console.error("Error analyzing feedback:", error);
    return { sentiment: "Neutral", analysis: "Error analyzing feedback" };
  }
}

export async function generateInsights(emotionStats: any[], recentFeedback: any[]): Promise<any[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are analyzing customer happiness data for T-Mobile. Generate actionable insights.
    
    Emotion Distribution:
    ${JSON.stringify(emotionStats, null, 2)}
    
    Recent Feedback (last 5):
    ${recentFeedback.map((f: any) => `- "${f.text}" (${f.sentiment})`).join('\n')}
    
    Return ONLY a JSON array of 3-4 insights with this format (no markdown):
    [
      {
        "type": "finding or recommendation",
        "title": "brief title",
        "description": "one sentence description with specific data",
        "priority": "high, medium, or low"
      }
    ]
    
    Focus on:
    - Identifying patterns in emotions and feedback
    - Actionable recommendations to improve customer experience
    - Correlations between sentiment and potential causes
    - Specific, data-driven insights`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return Array.isArray(parsed) ? parsed.slice(0, 4) : [];
    }

    return [];
  } catch (error) {
    console.error("Error generating insights:", error);
    return [];
  }
}
