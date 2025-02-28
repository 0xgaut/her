import { v4 as uuidv4 } from 'uuid';
import { AIApiService } from './AIApiService';
import { AIContextService } from './AIContextService';
import { AIRateLimitService } from './AIRateLimitService';
import { AIQueueService } from './AIQueueService';
import { 
  AIRequest, 
  AIResponse, 
  AIContext, 
  QueuedMessage, 
  AIServiceError,
  AIErrorCode,
  AIRequestOptions
} from './types';
import { ChatMessage, UserProfile } from '../../types/theme';

export class AIChatService {
  private apiService: AIApiService;
  private contextService: AIContextService;
  private rateLimitService: AIRateLimitService;
  private queueService: AIQueueService;
  
  constructor() {
    this.apiService = new AIApiService();
    this.contextService = new AIContextService();
    this.rateLimitService = new AIRateLimitService();
    this.queueService = new AIQueueService(this.processQueuedMessage.bind(this));
  }
  
  async initialize(): Promise<boolean> {
    const hasApiKey = await this.apiService.initialize();
    await this.queueService.initialize();
    return hasApiKey;
  }
  
  async setApiKey(key: string): Promise<void> {
    await this.apiService.setApiKey(key);
  }
  
  async hasApiKey(): Promise<boolean> {
    return this.apiService.hasApiKey();
  }
  
  async sendMessage(
    message: string,
    conversationId?: string,
    options?: AIRequestOptions
  ): Promise<ChatMessage> {
    // Get or create context
    let context: AIContext;
    if (conversationId) {
      const existingContext = await this.contextService.getContext(conversationId);
      if (!existingContext) {
        throw new Error(`Conversation with ID ${conversationId} not found`);
      }
      context = existingContext;
    } else {
      context = await this.contextService.createNewContext();
    }
    
    // Create user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      type: 'chat',
      content: message,
      role: 'user',
      timestamp: Date.now(),
      read: true
    };
    
    // Update context with user message
    context = await this.contextService.updateContextWithMessage(context, userMessage);
    
    // Check rate limits
    const canMakeRequest = await this.rateLimitService.canMakeRequest();
    if (!canMakeRequest) {
      throw this.createError(
        'Rate limit exceeded. Please try again later.',
        AIErrorCode.RATE_LIMIT
      );
    }
    
    // Create API request
    const apiMessages = this.contextService.convertToApiMessages(context);
    const request: AIRequest = {
      messages: apiMessages,
      options,
      model: 'gpt-4-turbo'
    };
    
    // Create placeholder for assistant response
    const assistantMessageId = uuidv4();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      type: 'chat',
      content: '',
      role: 'assistant',
      timestamp: Date.now(),
      read: false
    };
    
    // Update context with placeholder assistant message
    context = await this.contextService.updateContextWithMessage(context, assistantMessage);
    
    // Create queued message
    const queuedMessage: QueuedMessage = {
      id: assistantMessageId,
      request,
      context,
      priority: 'normal',
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3,
      onSuccess: async (response: AIResponse) => {
        // Update assistant message with response
        const assistantContent = response.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
        
        const updatedAssistantMessage: ChatMessage = {
          ...assistantMessage,
          content: assistantContent,
          timestamp: Date.now()
        };
        
        // Update context with final assistant message
        await this.contextService.updateContextWithMessage(context, updatedAssistantMessage);
        
        // Record token usage for rate limiting
        const tokenCount = response.usage?.totalTokens || 0;
        await this.rateLimitService.recordRequest(tokenCount);
      },
      onError: async (error: AIServiceError) => {
        // Update assistant message with error
        const errorMessage = 'Sorry, I encountered an error while processing your request. Please try again later.';
        
        const updatedAssistantMessage: ChatMessage = {
          ...assistantMessage,
          content: errorMessage,
          timestamp: Date.now()
        };
        
        // Update context with error message
        await this.contextService.updateContextWithMessage(context, updatedAssistantMessage);
      }
    };
    
    // Enqueue message
    await this.queueService.enqueue(queuedMessage);
    
    // Return the user message (client can listen for updates to the assistant message)
    return userMessage;
  }
  
  async getConversations(): Promise<AIContext[]> {
    return this.contextService.getAllContexts();
  }
  
  async getConversation(conversationId: string): Promise<AIContext | null> {
    return this.contextService.getContext(conversationId);
  }
  
  async deleteConversation(conversationId: string): Promise<void> {
    await this.contextService.clearContext(conversationId);
  }
  
  async getRateLimitStatus(): Promise<{
    minuteRemaining: number;
    hourRemaining: number;
    tokensRemaining: number;
  }> {
    return this.rateLimitService.getRemainingRequests();
  }
  
  async resetRateLimits(): Promise<void> {
    await this.rateLimitService.resetLimits();
  }
  
  getQueueLength(): number {
    return this.queueService.getQueueLength();
  }
  
  async clearQueue(): Promise<void> {
    await this.queueService.clear();
  }
  
  async updateUserProfile(userProfile: UserProfile): Promise<void> {
    const contexts = await this.contextService.getAllContexts();
    
    for (const context of contexts) {
      if (context.userProfile) {
        context.userProfile = userProfile;
        context.pregnancyWeek = userProfile.currentWeekOfPregnancy;
        await this.contextService.saveContext(context);
      }
    }
  }
  
  private async processQueuedMessage(message: QueuedMessage): Promise<AIResponse> {
    return this.apiService.sendRequest(message.request);
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

// Export singleton instance
export const aiChatService = new AIChatService(); 