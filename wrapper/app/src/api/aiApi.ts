import axios from 'axios';

const AI_API_BASE_URL = '/api/ai';

export interface AIResponse {
  response: string;
  model: string;
  provider: string;
  usage: { prompt_tokens: number; completion_tokens: number };
}

export const sendMessage = async (provider: string, prompt: string, model?: string): Promise<AIResponse> => {
  try {
    const response = await axios.post(`${AI_API_BASE_URL}/chat`, {
      provider,
      model: model || 'default',
      prompt,
    });
    return response.data;
  } catch (error) {
    console.error(`Error sending to ${provider}:`, error);
    throw error;
  }
};

export const getAvailableModels = async (provider?: string): Promise<{ id: string; name: string }[]> => {
  try {
    const response = await axios.get(`${AI_API_BASE_URL}/models`, {
      params: provider ? { provider } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching available models:', error);
    throw error;
  }
};

export const getProviders = async (): Promise<{ id: string; name: string; configured: boolean }[]> => {
  try {
    const response = await axios.get(`${AI_API_BASE_URL}/providers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
};
