import { storageService } from './storageService';
import { StorageError, StorageKey, SymptomEntry, SymptomType } from './types';

class SymptomStorageService {
  /**
   * Get all symptom entries
   */
  async getAllSymptoms(): Promise<SymptomEntry[]> {
    try {
      const symptoms = await storageService.getData<SymptomEntry[]>(StorageKey.SYMPTOM_ENTRIES);
      return symptoms || [];
    } catch (error) {
      throw new StorageError(
        'Failed to get symptom entries',
        StorageKey.SYMPTOM_ENTRIES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Add a new symptom entry
   */
  async addSymptom(symptom: Omit<SymptomEntry, 'id'>): Promise<SymptomEntry> {
    try {
      const symptoms = await this.getAllSymptoms();
      const newSymptom: SymptomEntry = {
        ...symptom,
        id: Date.now().toString(),
      };
      
      symptoms.push(newSymptom);
      await storageService.storeData(StorageKey.SYMPTOM_ENTRIES, symptoms);
      return newSymptom;
    } catch (error) {
      throw new StorageError(
        'Failed to add symptom entry',
        StorageKey.SYMPTOM_ENTRIES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Update a symptom entry
   */
  async updateSymptom(id: string, updates: Partial<SymptomEntry>): Promise<SymptomEntry | null> {
    try {
      const symptoms = await this.getAllSymptoms();
      const index = symptoms.findIndex((s) => s.id === id);
      
      if (index === -1) return null;
      
      const updatedSymptom = { ...symptoms[index], ...updates };
      symptoms[index] = updatedSymptom;
      
      await storageService.storeData(StorageKey.SYMPTOM_ENTRIES, symptoms);
      return updatedSymptom;
    } catch (error) {
      throw new StorageError(
        `Failed to update symptom entry: ${id}`,
        StorageKey.SYMPTOM_ENTRIES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Delete a symptom entry
   */
  async deleteSymptom(id: string): Promise<boolean> {
    try {
      const symptoms = await this.getAllSymptoms();
      const filteredSymptoms = symptoms.filter((s) => s.id !== id);
      
      if (filteredSymptoms.length === symptoms.length) {
        return false; // No symptom was deleted
      }
      
      await storageService.storeData(StorageKey.SYMPTOM_ENTRIES, filteredSymptoms);
      return true;
    } catch (error) {
      throw new StorageError(
        `Failed to delete symptom entry: ${id}`,
        StorageKey.SYMPTOM_ENTRIES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get symptoms by type
   */
  async getSymptomsByType(type: SymptomType): Promise<SymptomEntry[]> {
    try {
      const symptoms = await this.getAllSymptoms();
      return symptoms.filter((s) => s.type === type);
    } catch (error) {
      throw new StorageError(
        `Failed to get symptoms by type: ${type}`,
        StorageKey.SYMPTOM_ENTRIES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get symptoms by date range
   */
  async getSymptomsByDateRange(startTime: number, endTime: number): Promise<SymptomEntry[]> {
    try {
      const symptoms = await this.getAllSymptoms();
      return symptoms.filter((s) => s.timestamp >= startTime && s.timestamp <= endTime);
    } catch (error) {
      throw new StorageError(
        'Failed to get symptoms by date range',
        StorageKey.SYMPTOM_ENTRIES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Clear all symptom entries
   */
  async clearAllSymptoms(): Promise<void> {
    try {
      await storageService.storeData(StorageKey.SYMPTOM_ENTRIES, []);
    } catch (error) {
      throw new StorageError(
        'Failed to clear all symptom entries',
        StorageKey.SYMPTOM_ENTRIES,
        error instanceof Error ? error : undefined
      );
    }
  }
}

export const symptomStorageService = new SymptomStorageService(); 