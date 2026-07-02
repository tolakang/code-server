import axios from 'axios';

const AI_API_BASE_URL = '/api/ai';

export interface AIResponse {
  response: string;
  model: string;
  timestamp: string;
}

export const sendToOpenCode = async (prompt: string): Promise<AIResponse> => {
  try {
    const response = await axios.post(`${AI_API_BASE_URL}/opencode`, {
      prompt,
      model: 'opencode'
    });
    return response.data;
  } catch (error) {
    console.error('Error sending to OpenCode:', error);
    throw error;
  }
};

export const sendToClaude = async (prompt: string): Promise<AIResponse> => {
  try {
    const response = await axios.post(`${AI_API_BASE_URL}/claude`, {
      prompt,
      model: 'claude'
    });
    return response.data;
  } catch (error) {
    console.error('Error sending to Claude:', error);
    throw error;
  }
};

export const sendToCodex = async (prompt: string): Promise<AIResponse> => {
  try {
    const response = await axios.post(`${AI_API_BASE_URL}/codex`, {
      prompt,
      model: 'codex'
    });
    return response.data;
  } catch (error) {
    console.error('Error sending to Codex:', error);
    throw error;
  }
};

export const sendToGemini = async (prompt: string): Promise<AIResponse> => {
  try {
    const response = await axios.post(`${AI_API_BASE_URL}/gemini`, {
      prompt,
      model: 'gemini'
    });
    return response.data;
  } catch (error) {
    console.error('Error sending to Gemini:', error);
    throw error;
  }
};

export const sendToOpenRouter = async (prompt: string, model: string): Promise<AIResponse> => {
  try {
    const response = await axios.post(`${AI_API_BASE_URL}/openrouter`, {
      prompt,
      model
    });
    return response.data;
  } catch (error) {
    console.error('Error sending to OpenRouter:', error);
    throw error;
  }
};

export const getAvailableModels = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${AI_API_BASE_URL}/models`);
    return response.data.models;
  } catch (error) {
    console.error('Error fetching available models:', error);
    throw error;
  }
};