import { storageService } from './storageService';
import { AuthState, StorageError, StorageKey, UserProfile } from './types';

const DEFAULT_AUTH_STATE: AuthState = {
  isAuthenticated: false,
};

class AuthStorageService {
  /**
   * Get authentication state
   */
  async getAuthState(): Promise<AuthState> {
    try {
      const authState = await storageService.getData<AuthState>(StorageKey.AUTH_STATE);
      return authState || DEFAULT_AUTH_STATE;
    } catch (error) {
      throw new StorageError(
        'Failed to get authentication state',
        StorageKey.AUTH_STATE,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Save authentication state
   */
  async saveAuthState(authState: AuthState): Promise<void> {
    try {
      await storageService.storeData(StorageKey.AUTH_STATE, authState);
    } catch (error) {
      throw new StorageError(
        'Failed to save authentication state',
        StorageKey.AUTH_STATE,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(profile: UserProfile): Promise<void> {
    try {
      const authState = await this.getAuthState();
      await this.saveAuthState({
        ...authState,
        userProfile: profile,
      });
    } catch (error) {
      throw new StorageError(
        'Failed to update user profile',
        StorageKey.AUTH_STATE,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Set authenticated state
   */
  async setAuthenticated(
    userId: string,
    token: string,
    refreshToken: string,
    expiresAt: number,
    userProfile?: UserProfile
  ): Promise<void> {
    try {
      await this.saveAuthState({
        isAuthenticated: true,
        userId,
        token,
        refreshToken,
        expiresAt,
        userProfile,
      });
    } catch (error) {
      throw new StorageError(
        'Failed to set authenticated state',
        StorageKey.AUTH_STATE,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Clear authentication state (logout)
   */
  async clearAuth(): Promise<void> {
    try {
      await this.saveAuthState(DEFAULT_AUTH_STATE);
    } catch (error) {
      throw new StorageError(
        'Failed to clear authentication state',
        StorageKey.AUTH_STATE,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Check if the user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const authState = await this.getAuthState();
      
      if (!authState.isAuthenticated || !authState.expiresAt) {
        return false;
      }
      
      // Check if token is expired
      return authState.expiresAt > Date.now();
    } catch (error) {
      throw new StorageError(
        'Failed to check authentication status',
        StorageKey.AUTH_STATE,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get authentication token
   */
  async getToken(): Promise<string | null> {
    try {
      const authState = await this.getAuthState();
      
      if (!authState.isAuthenticated || !authState.token) {
        return null;
      }
      
      // Check if token is expired
      if (authState.expiresAt && authState.expiresAt <= Date.now()) {
        return null;
      }
      
      return authState.token;
    } catch (error) {
      throw new StorageError(
        'Failed to get authentication token',
        StorageKey.AUTH_STATE,
        error instanceof Error ? error : undefined
      );
    }
  }
}

export const authStorageService = new AuthStorageService(); 