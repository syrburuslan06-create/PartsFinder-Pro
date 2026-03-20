import { GoogleGenAI, Type } from "@google/genai";
import { GeminiSearchResult, SearchResponse, VinDetails } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function decodeVin(vin: string): Promise<VinDetails | null> {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Decode the following VIN (Vehicle Identification Number) and provide a detailed breakdown of the vehicle specifications.
    VIN: ${vin}
    
    Return the data in a structured JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ text: prompt }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            year: { type: Type.STRING },
            make: { type: Type.STRING },
            model: { type: Type.STRING },
            engine: { type: Type.STRING },
            trim: { type: Type.STRING },
            transmission: { type: Type.STRING },
            driveType: { type: Type.STRING },
            bodyStyle: { type: Type.STRING },
            manufacturedIn: { type: Type.STRING }
          },
          required: ['year', 'make', 'model', 'engine', 'trim', 'transmission', 'driveType', 'bodyStyle', 'manufacturedIn']
        }
      }
    });

    return JSON.parse(response.text || 'null');
  } catch (error) {
    console.error("VIN Decode Error:", error);
    return null;
  }
}

const CAR_PARTS_WEBSITES = [
  "RockAuto", "PartsGeek", "CarParts.com", "AutoZone", "JEGS", 
  "Buy Auto Parts", "OEM Parts Online", "1A Auto", "Advance Auto Parts", 
  "NAPA Auto Parts", "Car-Part.com", "AmericanTrucks", "4 Wheel Online", 
  "CSI Accessories", "PartsVoice"
];

const TRUCK_PARTS_WEBSITES = [
  "FinditParts", "TruckPro", "Beltway Truck Parts", "DEX Heavy Duty Parts", 
  "Mr Truck Parts", "Wheeler Fleet", "Custom Truck One Source", 
  "CarParts.com", "AutoZone", "Advance Auto Parts", "NAPA Auto Parts"
];

export async function searchParts(params: {
  vehicleType?: string;
  partNumber?: string;
  description?: string;
  make?: string;
  model?: string;
  year?: string;
  motor?: string;
  vin?: string;
  vehicle?: string;
  image?: string; // base64
}): Promise<SearchResponse> {
  const model = "gemini-3-flash-preview";
  
  const allowedWebsites = params.vehicleType === 'truck' ? TRUCK_PARTS_WEBSITES : CAR_PARTS_WEBSITES;

  const prompt = `
    You are an expert auto parts specialist for PartsFinder Pro.
    Analyze the following search parameters and return a list of 3-5 matching or highly relevant parts.
    
    CRITICAL INSTRUCTIONS:
    1. ONLY search for parts from the following authorized US websites:
       ${allowedWebsites.join(', ')}
    2. Use the provided Google Search tool to find the EXACT product pages on these specific sites.
    3. DO NOT hallucinate or guess URLs. Use the actual URLs returned by the Google Search tool.
    4. For each part, identify the most direct URL where the part can be purchased from the allowed websites and include it as 'sourceUrl'.
    5. The 'sourceUrl' MUST be a valid, direct link to the product page on the supplier's website.
    6. Analyze real-time pricing and user ratings from search results.
    7. ONLY return parts that have a user rating between 3.5 and 5.0 stars.
    8. Prioritize parts with the best value (competitive pricing and high ratings).
    9. If a VIN or specific vehicle details are provided, ensure exact fitment verification.
    10. Calculate a 'Trust Score' for each result using the following Enterprise Formula:
        Trust Score = (partNumberMatch * 0.3) + (priceCompetitiveness * 0.2) + (supplierReliability * 0.2) + (historicalSuccess * 0.1) + (userRating * 0.1) + (aiConfidence * 0.1)
        - partNumberMatch: 100 if exact, 0-90 if partial/related.
        - priceCompetitiveness: 100 if lowest price found, lower if higher.
        - supplierReliability: Based on known US supplier reputation (e.g., RockAuto/NAPA = 95+, others vary).
        - historicalSuccess: Estimated based on part popularity and reviews.
        - userRating: (rating / 5) * 100.
        - aiConfidence: Your internal confidence in the fitment match (0-100).
    
    Search Parameters:
    - Vehicle Identification (VIN/Name): ${params.vehicle || 'Not specified'}
    - Vehicle Type: ${params.vehicleType || 'Not specified'}
    - VIN: ${params.vin || 'Not specified'}
    - Part Number: ${params.partNumber || 'Not specified'}
    - Description/Need: ${params.description || 'Not specified'}
    - Vehicle Details: ${params.year || ''} ${params.make || ''} ${params.model || ''} (${params.motor || ''})
    ${params.image ? '- An image of the part was provided.' : ''}

    Return the results in a structured JSON format.
  `;

  const contents: any[] = [{ text: prompt }];
  
  if (params.image) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: params.image.split(',')[1] || params.image
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: contents },
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              partName: { type: Type.STRING },
              partNumber: { type: Type.STRING },
              compatibility: { type: Type.STRING },
              price: { type: Type.STRING },
              availability: { type: Type.STRING, enum: ['In Stock', 'Low Stock', 'Out of Stock'] },
              supplier: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              description: { type: Type.STRING },
              rating: { type: Type.NUMBER, description: "Average user rating from 0 to 5" },
              reviewsCount: { type: Type.INTEGER, description: "Number of user reviews" },
              sourceUrl: { type: Type.STRING, description: "Direct URL to purchase the part" },
              trustScore: { type: Type.NUMBER, description: "Calculated Enterprise Trust Score (0-100)" },
              scoringDetails: {
                type: Type.OBJECT,
                properties: {
                  partNumberMatch: { type: Type.NUMBER },
                  priceCompetitiveness: { type: Type.NUMBER },
                  supplierReliability: { type: Type.NUMBER },
                  historicalSuccess: { type: Type.NUMBER },
                  userRating: { type: Type.NUMBER },
                  aiConfidence: { type: Type.NUMBER }
                },
                required: ['partNumberMatch', 'priceCompetitiveness', 'supplierReliability', 'historicalSuccess', 'userRating', 'aiConfidence']
              }
            },
            required: ['partName', 'partNumber', 'compatibility', 'price', 'availability', 'supplier', 'confidence', 'description', 'rating', 'reviewsCount', 'trustScore', 'scoringDetails']
          }
        }
      }
    });

    return {
      results: JSON.parse(response.text || '[]'),
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return { results: [] };
  }
}
