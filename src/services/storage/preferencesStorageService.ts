import { storageService } from './storageService';
import { StorageError, StorageKey, UserPreferences } from './types';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  notifications: true,
  language: 'en',
  fontSize: 'medium',
  hasCompletedOnboarding: false,
};

class PreferencesStorageService {
  /**
   * Get user preferences
   */
  async getPreferences(): Promise<UserPreferences> {
    try {
      const preferences = await storageService.getData<UserPreferences>(StorageKey.USER_PREFERENCES);
      return preferences || DEFAULT_PREFERENCES;
    } catch (error) {
      throw new StorageError(
        'Failed to get user preferences',
        StorageKey.USER_PREFERENCES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Save user preferences
   */
  async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      await storageService.storeData(StorageKey.USER_PREFERENCES, preferences);
    } catch (error) {
      throw new StorageError(
        'Failed to save user preferences',
        StorageKey.USER_PREFERENCES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Update specific preference fields
   */
  async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const currentPreferences = await this.getPreferences();
      const updatedPreferences = { ...currentPreferences, ...updates };
      await this.savePreferences(updatedPreferences);
      return updatedPreferences;
    } catch (error) {
      throw new StorageError(
        'Failed to update user preferences',
        StorageKey.USER_PREFERENCES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Reset preferences to defaults
   */
  async resetPreferences(): Promise<void> {
    try {
      await this.savePreferences(DEFAULT_PREFERENCES);
    } catch (error) {
      throw new StorageError(
        'Failed to reset user preferences',
        StorageKey.USER_PREFERENCES,
        error instanceof Error ? error : undefined
      );
    }
  }
}

export const preferencesStorageService = new PreferencesStorageService(); 