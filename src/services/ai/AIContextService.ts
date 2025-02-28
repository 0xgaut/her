import { AIContext, AIRequestMessage } from './types';
import { ChatMessage, UserProfile } from '../../types/theme';
import { storageService } from '../storage/storageService';

export class AIContextService {
  private static readonly MAX_CONTEXT_MESSAGES = 20;
  private static readonly CONTEXT_STORAGE_KEY = 'ai_context';
  
  async getContext(conversationId: string): Promise<AIContext | null> {
    try {
      const contexts = await storageService.getData<Record<string, AIContext>>(AIContextService.CONTEXT_STORAGE_KEY) || {};
      return contexts[conversationId] || null;
    } catch (error) {
      console.error('Failed to get AI context:', error);
      return null;
    }
  }
  
  async saveContext(context: AIContext): Promise<void> {
    try {
      const contexts = await storageService.getData<Record<string, AIContext>>(AIContextService.CONTEXT_STORAGE_KEY) || {};
      contexts[context.conversationId] = {
        ...context,
        // Limit the message history to prevent context from growing too large
        messageHistory: context.messageHistory.slice(-AIContextService.MAX_CONTEXT_MESSAGES)
      };
      await storageService.storeData(AIContextService.CONTEXT_STORAGE_KEY, contexts);
    } catch (error) {
      console.error('Failed to save AI context:', error);
    }
  }
  
  async createNewContext(userProfile?: UserProfile): Promise<AIContext> {
    const conversationId = Date.now().toString();
    const context: AIContext = {
      conversationId,
      messageHistory: [],
      userProfile,
      pregnancyWeek: userProfile?.currentWeekOfPregnancy
    };
    
    await this.saveContext(context);
    return context;
  }
  
  async updateContextWithMessage(message: ChatMessage): Promise<AIContext> {
    // Find the context that this message belongs to
    const contexts = await storageService.getData<Record<string, AIContext>>(AIContextService.CONTEXT_STORAGE_KEY) || {};
    
    // Find the context by matching the message ID pattern or create a new one
    let contextId = Object.keys(contexts).find(id => 
      contexts[id].messageHistory.some(m => m.id === message.id)
    );
    
    if (!contextId) {
      // If no context found, create a new one
      const newContext = await this.createNewContext();
      contextId = newContext.conversationId;
    }
    
    const context = contexts[contextId];
    
    // Update the context with the new message
    const updatedContext = {
      ...context,
      messageHistory: [...context.messageHistory, message]
    };
    
    // Save the updated context
    await this.saveContext(updatedContext);
    
    return updatedContext;
  }
  
  async clearContext(conversationId: string): Promise<void> {
    try {
      const contexts = await storageService.getData<Record<string, AIContext>>(AIContextService.CONTEXT_STORAGE_KEY) || {};
      delete contexts[conversationId];
      await storageService.storeData(AIContextService.CONTEXT_STORAGE_KEY, contexts);
    } catch (error) {
      console.error('Failed to clear AI context:', error);
    }
  }
  
  async getAllContexts(): Promise<AIContext[]> {
    try {
      const contexts = await storageService.getData<Record<string, AIContext>>(AIContextService.CONTEXT_STORAGE_KEY) || {};
      return Object.values(contexts);
    } catch (error) {
      console.error('Failed to get all AI contexts:', error);
      return [];
    }
  }
  
  getSystemPrompt(context: AIContext): string {
    let systemPrompt = context.systemPrompt || 
      "You are a helpful pregnancy assistant providing evidence-based information. Always clarify that you're providing general information and not medical advice.";
    
    if (context.pregnancyWeek) {
      systemPrompt += ` The user is currently in week ${context.pregnancyWeek} of pregnancy.`;
    }
    
    if (context.userProfile?.medicalConditions?.length) {
      systemPrompt += ` The user has reported the following medical conditions: ${context.userProfile.medicalConditions.join(', ')}.`;
    }
    
    return systemPrompt;
  }
  
  convertToApiMessages(context: AIContext): AIRequestMessage[] {
    const messages: AIRequestMessage[] = [
      { role: 'system', content: this.getSystemPrompt(context) }
    ];
    
    // Add conversation history
    context.messageHistory.forEach(message => {
      if (message.role === 'user' || message.role === 'assistant') {
        messages.push({
          role: message.role,
          content: message.content
        });
      }
    });
    
    return messages;
  }
} 