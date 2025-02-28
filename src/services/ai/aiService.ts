import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  choices: {
    message: Message;
    finish_reason: string;
  }[];
}

class AIService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1';
  private model = 'gpt-4-turbo';

  async initialize(): Promise<void> {
    if (Platform.OS !== 'web') {
      this.apiKey = await SecureStore.getItemAsync('openai_api_key');
    }
  }

  async setApiKey(key: string): Promise<void> {
    this.apiKey = key;
    if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync('openai_api_key', key);
    }
  }

  async getApiKey(): Promise<string | null> {
    return this.apiKey;
  }

  async hasApiKey(): Promise<boolean> {
    return this.apiKey !== null;
  }

  async sendMessage(messages: Message[]): Promise<Message | null> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from AI service');
      }

      const data = await response.json() as ChatCompletionResponse;
      return data.choices[0].message;
    } catch (error) {
      console.error('Error sending message to AI service:', error);
      return null;
    }
  }

  // Specialized method for pregnancy-related queries
  async getPregnancyAdvice(query: string, weekOfPregnancy?: number): Promise<Message | null> {
    const systemPrompt = `You are a helpful pregnancy assistant providing evidence-based information about pregnancy. 
    ${weekOfPregnancy ? `The user is currently in week ${weekOfPregnancy} of pregnancy.` : ''}
    Always clarify that you're providing general information and not medical advice. 
    Recommend consulting healthcare providers for personal medical concerns.`;
    
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query }
    ];
    
    return this.sendMessage(messages);
  }
}

export const aiService = new AIService(); 