import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageError, StorageKey } from './types';

class StorageService {
  /**
   * Store data in AsyncStorage
   */
  async storeData<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Storage error while storing data:', error);
      throw new StorageError(
        `Failed to store data for key: ${key}`,
        key,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Retrieve data from AsyncStorage
   */
  async getData<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) as T : null;
    } catch (error) {
      console.error('Storage error while retrieving data:', error);
      throw new StorageError(
        `Failed to retrieve data for key: ${key}`,
        key,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Remove data from AsyncStorage
   */
  async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error while removing data:', error);
      throw new StorageError(
        `Failed to remove data for key: ${key}`,
        key,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Clear all data from AsyncStorage
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage error while clearing all data:', error);
      throw new StorageError(
        'Failed to clear all data',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get all keys from AsyncStorage
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Storage error while getting all keys:', error);
      throw new StorageError(
        'Failed to get all keys',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Check if a key exists in AsyncStorage
   */
  async hasKey(key: string): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.includes(key);
    } catch (error) {
      console.error('Storage error while checking key existence:', error);
      throw new StorageError(
        `Failed to check if key exists: ${key}`,
        key,
        error instanceof Error ? error : undefined
      );
    }
  }

  // Pregnancy-specific storage methods
  async savePregnancyData(data: PregnancyData): Promise<void> {
    return this.storeData('pregnancy_data', data);
  }

  async getPregnancyData(): Promise<PregnancyData | null> {
    return this.getData<PregnancyData>('pregnancy_data');
  }

  async saveChatHistory(chatHistory: ChatMessage[]): Promise<void> {
    return this.storeData('chat_history', chatHistory);
  }

  async getChatHistory(): Promise<ChatMessage[] | null> {
    return this.getData<ChatMessage[]>('chat_history');
  }
}

export interface PregnancyData {
  dueDate: string;
  lastPeriodDate: string;
  currentWeek: number;
  babySize?: string;
  appointments?: {
    date: string;
    title: string;
    notes?: string;
  }[];
  symptoms?: {
    date: string;
    type: string;
    severity: number;
    notes?: string;
  }[];
  weightLog?: {
    date: string;
    weight: number;
    unit: 'kg' | 'lb';
  }[];
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
}

export const storageService = new StorageService(); 