import { GoogleGenerativeAI } from '@google/generative-ai';

// Define types for better TypeScript support
interface FormData {
  age: number;
  weight: number;
  height: number;
  symptoms: string[];
}

interface PredictionResult {
  success: boolean;
  prediction?: string;
  error?: string;
  timestamp?: string;
}

interface StructuredAnalysis {
  riskLevel: string;
  riskScore: number;
  keyFactors: string[];
  recommendations: string[];
  consultation: string;
  disclaimer: string;
}

interface StructuredPredictionResult {
  success: boolean;
  data?: StructuredAnalysis;
  prediction?: string;
  error?: string;
}
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not defined in environment variables');
  }
  return apiKey;
};

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(getApiKey());

export const pcod_prediction = async (formData: FormData): Promise<PredictionResult> => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Calculate BMI
    const bmi = (formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1);

    // Prepare the prompt with form data
    const prompt = `
    As a medical AI assistant, analyze the following health data and provide insights about PCOD (Polycystic Ovary Syndrome) risk:

    Patient Information:
    - Age: ${formData.age} years
    - Weight: ${formData.weight} kg
    - Height: ${formData.height} cm
    - BMI: ${bmi}
    - Symptoms: ${formData.symptoms.join(', ')}

    Please provide:
    1. PCOD Risk Assessment (Low/Medium/High)
    2. Key Risk Factors identified
    3. Recommended next steps
    4. Lifestyle suggestions
    5. When to consult a healthcare professional

    Format your response in a clear, readable manner with proper sections.
    Note: This is for informational purposes only and should not replace professional medical advice.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      success: true,
      prediction: text,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error getting PCOD prediction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get prediction. Please try again.'
    };
  }
};

// Alternative function for structured prediction
export const getStructuredPCODAnalysis = async (formData: FormData): Promise<StructuredPredictionResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const bmi = (formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1);

    const prompt = `
    Analyze this health data for PCOD risk assessment. Respond in JSON format:

    Data:
    - Age: ${formData.age}
    - Weight: ${formData.weight}kg  
    - Height: ${formData.height}cm
    - BMI: ${bmi}
    - Symptoms: ${formData.symptoms.join(', ')}

    Please respond with this exact JSON structure (no additional text):
    {
      "riskLevel": "Low|Medium|High",
      "riskScore": 5,
      "keyFactors": ["factor1", "factor2", "factor3"],
      "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
      "consultation": "when to see doctor advice",
      "disclaimer": "This analysis is for informational purposes only and should not replace professional medical advice."
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    try {
      const cleanedText = text.replace(/``````/g, '').trim();
      const jsonResponse = JSON.parse(cleanedText);
      return { success: true, data: jsonResponse };
    } catch (parseError) {
      // If JSON parsing fails, return raw text
      return { success: true, prediction: text };
    }

  } catch (error) {
    console.error('Error getting structured analysis:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get structured analysis.'
    };
  }
};
