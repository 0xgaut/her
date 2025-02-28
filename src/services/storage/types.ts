import { CustomMessage } from '../../components/chat/types';
import { SymptomType } from '../../types/theme';

// User Preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  pregnancyWeek?: number;
  dueDate?: string;
  lastPeriodDate?: string;
  hasCompletedOnboarding: boolean;
}

// Symptom Tracking
export interface SymptomEntry {
  id: string;
  timestamp: number;
  type: SymptomType;
  severity: number;
  notes?: string;
}

// Learning Progress
export interface LearningModule {
  id: string;
  title: string;
  category: 'development' | 'nutrition' | 'exercise' | 'mental-health' | 'preparation';
  progress: number; // 0-100
  completed: boolean;
  lastAccessed: number;
  savedForLater: boolean;
}

// Authentication State
export interface AuthState {
  isAuthenticated: boolean;
  userId?: string;
  token?: string;
  refreshToken?: string;
  expiresAt?: number;
  userProfile?: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  pregnancyWeek?: number;
  dueDate?: string;
  medicalConditions?: string[];
  createdAt: number;
  updatedAt: number;
}

// Storage Keys
export enum StorageKey {
  USER_PREFERENCES = 'user_preferences',
  CHAT_MESSAGES = 'chat_messages',
  SYMPTOM_ENTRIES = 'symptom_entries',
  LEARNING_MODULES = 'learning_modules',
  AUTH_STATE = 'auth_state',
}

// Storage Service Error
export class StorageError extends Error {
  constructor(message: string, public readonly key?: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'StorageError';
  }
} 