import { GoogleGenAI, Type } from "@google/genai";
import { RouteRequest, TravelOption, TransportMode, Preference } from "../types";
import { trafficService } from "./trafficService";
import { z } from "zod";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const CoordinateSchema = z.object({
  lat: z.number(),
  lng: z.number()
});

const RouteLegSchema = z.object({
  mode: z.string().transform((val) => {
    const upper = val.toUpperCase();
    if (upper === 'CAR' || upper === 'TAXI') return TransportMode.CAB;
    if (upper === 'TRANSIT') return TransportMode.METRO;
    if (upper === 'TRAIN') return TransportMode.LOCAL_TRAIN;
    return upper;
  }).pipe(z.nativeEnum(TransportMode)),
  provider: z.string().optional(),
  duration: z.number().positive(),
  distance: z.number().nonnegative(),
  cost: z.number().nonnegative(),
  instructions: z.string(),
  delayMinutes: z.number().optional(),
  isSurgePricing: z.boolean().optional(),
  isRideShare: z.boolean().optional(),
  path: z.array(CoordinateSchema).optional(),
  deepLink: z.string().optional(),
  crowdLevel: z.enum(['Quiet', 'Busy', 'Crowded', 'Standing Room Only']).optional()
});

const RouteInsightSchema = z.object({
  type: z.enum(['price', 'crowd', 'weather', 'time']),
  message: z.string(),
  trend: z.enum(['up', 'down', 'stable']),
  value: z.string().optional()
});

const TravelOptionSchema = z.object({
  id: z.string(),
  title: z.string(),
  totalDuration: z.number().positive(),
  totalCost: z.number().nonnegative(),
  totalDistance: z.number().nonnegative(),
  carbonFootprint: z.number().nonnegative(),
  score: z.number().min(0).max(100),
  isWheelchairFriendly: z.boolean(),
  trafficStatus: z.enum(["Low", "Moderate", "Heavy", "Gridlock"]),
  tags: z.array(z.string()),
  weather: z.object({
    condition: z.enum(["Sunny", "Rainy", "Cloudy", "Humid"]),
    temp: z.number(),
    alert: z.string().optional()
  }).optional(),
  legs: z.array(RouteLegSchema),
  insights: z.array(RouteInsightSchema).optional(),
  bestTimeToLeave: z.string().optional()
});

const TravelOptionsResponseSchema = z.array(TravelOptionSchema);

export class TransitAPIError extends Error {
  constructor(public message: string, public code: 'VALIDATION_ERROR' | 'NETWORK_ERROR' | 'AI_ERROR') {
    super(message);
    this.name = 'TransitAPIError';
  }
}

export const getSmartRoutes = async (request: RouteRequest): Promise<TravelOption[]> => {
  const ai = getAI();
  const currentTime = new Date().toLocaleTimeString();
  const allowedModes = Object.values(TransportMode);
  
  // Simulation: Fetch "Live Traffic Data" to inject into prompt context
  const trafficContext = await trafficService.getCityTrafficData(request.city);
  const trafficString = trafficContext.map(z => `${z.name}: ${z.density}`).join(', ');

  const prompt = `
    Act as a World-Class MaaS Aggregator for India.
    Current Time: ${currentTime}
    CITY TRAFFIC FEED: ${trafficString}
    
    Find 3 multimodal routes in ${request.city} from ${request.source} to ${request.destination}.
    
    TRAFFIC CONSTRAINTS:
    1. If any zone is "Gridlock", deprioritize CAB/AUTO/BUS. Prefer METRO/TRAIN.
    2. Adjust 'totalDuration' and 'delayMinutes' based on this live feed.
    3. If preference is ${request.preference}, ensure the score reflects this.
    
    Respond strictly in JSON format.
  `;

  try {
    // Use gemini-3-pro-preview for complex reasoning and route optimization
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              totalDuration: { type: Type.NUMBER },
              totalCost: { type: Type.NUMBER },
              totalDistance: { type: Type.NUMBER },
              carbonFootprint: { type: Type.NUMBER },
              score: { type: Type.NUMBER },
              isWheelchairFriendly: { type: Type.BOOLEAN },
              trafficStatus: { type: Type.STRING, enum: ["Low", "Moderate", "Heavy", "Gridlock"] },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              bestTimeToLeave: { type: Type.STRING },
              insights: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, enum: ['price', 'crowd', 'weather', 'time'] },
                    message: { type: Type.STRING },
                    trend: { type: Type.STRING, enum: ['up', 'down', 'stable'] },
                    value: { type: Type.STRING }
                  }
                }
              },
              legs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    mode: { type: Type.STRING, enum: allowedModes },
                    provider: { type: Type.STRING },
                    duration: { type: Type.NUMBER },
                    distance: { type: Type.NUMBER },
                    cost: { type: Type.NUMBER },
                    instructions: { type: Type.STRING },
                    delayMinutes: { type: Type.NUMBER },
                    crowdLevel: { type: Type.STRING, enum: ['Quiet', 'Busy', 'Crowded', 'Standing Room Only'] }
                  },
                  required: ["mode", "duration", "distance", "cost", "instructions"]
                }
              }
            },
            required: ["id", "title", "totalDuration", "totalCost", "legs", "score", "isWheelchairFriendly", "trafficStatus"]
          }
        }
      }
    });

    const text = response.text?.trim();
    if (!text) throw new TransitAPIError("Empty response from AI", 'AI_ERROR');

    const rawData = JSON.parse(text);
    const validated = TravelOptionsResponseSchema.safeParse(rawData);

    if (!validated.success) {
      console.error("[Validation Error]", validated.error);
      throw new TransitAPIError("Invalid AI response format", 'VALIDATION_ERROR');
    }

    return validated.data as TravelOption[];
  } catch (error) {
    console.error("[Transit Service Error]", error);
    if (error instanceof TransitAPIError) throw error;
    throw new TransitAPIError("Route aggregation failed", 'NETWORK_ERROR');
  }
};

export const parseNaturalQuery = async (query: string): Promise<Partial<RouteRequest>> => {
  const ai = getAI();
  const prompt = `Extract: source, destination, city, preference from this query: "${query}". Respond only with JSON.`;
  try {
    // Use gemini-3-flash-preview for efficient natural language parsing
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            source: { type: Type.STRING },
            destination: { type: Type.STRING },
            city: { type: Type.STRING },
            preference: { type: Type.STRING, enum: Object.values(Preference) }
          }
        }
      }
    });
    const text = response.text?.trim();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.warn("[Parse Query Error]", error);
    return {};
  }
};
