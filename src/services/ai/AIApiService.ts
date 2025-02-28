import { AIRequest, AIResponse, AIServiceError, AIErrorCode } from './types';
import * as SecureStore from 'expo-secure-store';

export class AIApiService {
  private apiKey: string | null = null;
  private baseUrl: string;
  private defaultModel: string;
  
  constructor(baseUrl: string = 'https://api.openai.com/v1', defaultModel: string = 'gpt-4-turbo') {
    this.baseUrl = baseUrl;
    this.defaultModel = defaultModel;
  }
  
  async initialize(): Promise<boolean> {
    try {
      this.apiKey = await SecureStore.getItemAsync('ai_api_key');
      return this.apiKey !== null;
    } catch (error) {
      console.error('Failed to initialize AI API service:', error);
      return false;
    }
  }
  
  async setApiKey(key: string): Promise<void> {
    this.apiKey = key;
    await SecureStore.setItemAsync('ai_api_key', key);
  }
  
  async clearApiKey(): Promise<void> {
    this.apiKey = null;
    await SecureStore.deleteItemAsync('ai_api_key');
  }
  
  async hasApiKey(): Promise<boolean> {
    return this.apiKey !== null;
  }
  
  async sendRequest(request: AIRequest): Promise<AIResponse> {
    if (!this.apiKey) {
      throw this.createError(
        'API key not set',
        AIErrorCode.AUTHENTICATION_ERROR
      );
    }
    
    const model = request.model || this.defaultModel;
    const options = request.options || {};
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: request.messages,
          max_tokens: options.maxTokens,
          temperature: options.temperature ?? 0.7,
          top_p: options.topP,
          frequency_penalty: options.frequencyPenalty,
          presence_penalty: options.presencePenalty,
          stream: options.stream ?? false,
          stop: options.stopSequences,
        }),
        signal: options.timeout ? AbortSignal.timeout(options.timeout) : undefined
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '60', 10);
          throw this.createError(
            'Rate limit exceeded',
            AIErrorCode.RATE_LIMIT,
            response.status,
            retryAfter
          );
        }
        
        // Handle authentication errors
        if (response.status === 401) {
          throw this.createError(
            'Invalid API key',
            AIErrorCode.AUTHENTICATION_ERROR,
            response.status
          );
        }
        
        // Handle server errors
        if (response.status >= 500) {
          throw this.createError(
            'AI service unavailable',
            AIErrorCode.SERVER_ERROR,
            response.status
          );
        }
        
        // Handle other errors
        throw this.createError(
          errorData.error?.message || 'Unknown API error',
          AIErrorCode.API_ERROR,
          response.status
        );
      }
      
      return await response.json() as AIResponse;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw this.createError(
          'Request timed out',
          AIErrorCode.TIMEOUT,
          undefined,
          undefined,
          error
        );
      }
      
      if (error instanceof TypeError && error.message.includes('network')) {
        throw this.createError(
          'Network error',
          AIErrorCode.NETWORK_ERROR,
          undefined,
          undefined,
          error
        );
      }
      
      // If it's already our error type, just rethrow it
      if ((error as AIServiceError).code) {
        throw error;
      }
      
      // Otherwise, wrap it as an unknown error
      throw this.createError(
        'Unknown error during API request',
        AIErrorCode.UNKNOWN,
        undefined,
        undefined,
        error
      );
    }
  }
  
  private createError(
    message: string,
    code: AIErrorCode,
    status?: number,
    retryAfter?: number,
    originalError?: any
  ): AIServiceError {
    const error = new Error(message) as AIServiceError;
    error.code = code;
    error.status = status;
    error.retryAfter = retryAfter;
    error.originalError = originalError;
    return error;
  }
} 