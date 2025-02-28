export interface PregnancyMilestone {
  week: number;
  title: string;
  description: string;
  babySize: string;
  babyWeight?: string;
  babyLength?: string;
  tips: string[];
  symptoms: string[];
}

export interface UserProfile {
  name: string;
  email?: string;
  dueDate?: string;
  weekOfPregnancy?: number;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  apiKey?: string;
} 