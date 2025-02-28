import { ChatMessage, UserProfile } from '../../types/theme';

// Request and Response Types
export interface AIRequestOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stream?: boolean;
  stopSequences?: string[];
  timeout?: number;
}

export interface AIRequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIRequest {
  messages: AIRequestMessage[];
  options?: AIRequestOptions;
  model: string;
}

export interface AIResponseChoice {
  index: number;
  message: AIRequestMessage;
  finishReason: 'stop' | 'length' | 'content_filter' | 'function_call' | null;
}

export interface AIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: AIResponseChoice[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Error Types
export interface AIServiceError extends Error {
  code: AIErrorCode;
  status?: number;
  retryAfter?: number;
  originalError?: any;
}

export enum AIErrorCode {
  NETWORK_ERROR = 'network_error',
  TIMEOUT = 'timeout',
  RATE_LIMIT = 'rate_limit',
  API_ERROR = 'api_error',
  AUTHENTICATION_ERROR = 'authentication_error',
  INVALID_REQUEST = 'invalid_request',
  SERVER_ERROR = 'server_error',
  UNKNOWN = 'unknown',
}

// Context Types
export interface AIContext {
  userProfile?: UserProfile;
  conversationId: string;
  messageHistory: ChatMessage[];
  systemPrompt?: string;
  pregnancyWeek?: number;
}

// Queue Types
export interface QueuedMessage {
  id: string;
  request: AIRequest;
  context: AIContext;
  priority: 'high' | 'normal' | 'low';
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  onSuccess?: (response: AIResponse) => void;
  onError?: (error: AIServiceError) => void;
}

// Rate Limiting
export interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  maxTokensPerDay: number;
} 