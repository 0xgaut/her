import { CustomMessage } from '../../components/chat/types';
import { storageService } from './storageService';
import { StorageError, StorageKey } from './types';

class MessageStorageService {
  private getConversationKey(conversationId: string): string {
    return `${StorageKey.CHAT_MESSAGES}_${conversationId}`;
  }

  /**
   * Save messages for a specific conversation
   */
  async saveMessages(conversationId: string, messages: CustomMessage[]): Promise<void> {
    try {
      const key = this.getConversationKey(conversationId);
      await storageService.storeData(key, messages);
    } catch (error) {
      throw new StorageError(
        `Failed to save messages for conversation: ${conversationId}`,
        conversationId,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get messages for a specific conversation
   */
  async getMessages(conversationId: string): Promise<CustomMessage[]> {
    try {
      const key = this.getConversationKey(conversationId);
      const messages = await storageService.getData<CustomMessage[]>(key);
      return messages || [];
    } catch (error) {
      throw new StorageError(
        `Failed to get messages for conversation: ${conversationId}`,
        conversationId,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Add a single message to a conversation
   */
  async addMessage(conversationId: string, message: CustomMessage): Promise<void> {
    try {
      const messages = await this.getMessages(conversationId);
      messages.unshift(message); // Add to beginning (newest first)
      await this.saveMessages(conversationId, messages);
    } catch (error) {
      throw new StorageError(
        `Failed to add message to conversation: ${conversationId}`,
        conversationId,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Update a message in a conversation
   */
  async updateMessage(
    conversationId: string,
    messageId: string,
    updates: Partial<CustomMessage>
  ): Promise<void> {
    try {
      const messages = await this.getMessages(conversationId);
      const updatedMessages = messages.map((msg) =>
        msg._id === messageId ? { ...msg, ...updates } : msg
      );
      await this.saveMessages(conversationId, updatedMessages);
    } catch (error) {
      throw new StorageError(
        `Failed to update message in conversation: ${conversationId}`,
        conversationId,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Delete a message from a conversation
   */
  async deleteMessage(conversationId: string, messageId: string): Promise<void> {
    try {
      const messages = await this.getMessages(conversationId);
      const filteredMessages = messages.filter((msg) => msg._id !== messageId);
      await this.saveMessages(conversationId, filteredMessages);
    } catch (error) {
      throw new StorageError(
        `Failed to delete message from conversation: ${conversationId}`,
        conversationId,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Clear all messages for a conversation
   */
  async clearConversation(conversationId: string): Promise<void> {
    try {
      const key = this.getConversationKey(conversationId);
      await storageService.removeData(key);
    } catch (error) {
      throw new StorageError(
        `Failed to clear conversation: ${conversationId}`,
        conversationId,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get all conversation IDs
   */
  async getAllConversationIds(): Promise<string[]> {
    try {
      const allKeys = await storageService.getAllKeys();
      const prefix = StorageKey.CHAT_MESSAGES;
      return allKeys
        .filter((key) => key.startsWith(prefix))
        .map((key) => key.substring(prefix.length + 1)); // +1 for the underscore
    } catch (error) {
      throw new StorageError(
        'Failed to get all conversation IDs',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }
}

export const messageStorageService = new MessageStorageService(); 