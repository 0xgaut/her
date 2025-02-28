// Message Types
export interface BaseMessage {
  id: string;
  timestamp: number;
  read: boolean;
}

export interface ChatMessage extends BaseMessage {
  type: 'chat';
  content: string;
  role: 'user' | 'assistant' | 'system';
  attachments?: Attachment[];
}

export interface SymptomMessage extends BaseMessage {
  type: 'symptom';
  symptomType: SymptomType;
  severity: number; // 1-10
  duration: number; // in minutes
  notes?: string;
  recurrence?: 'first-time' | 'occasional' | 'frequent' | 'constant';
}

export interface LearningCardMessage extends BaseMessage {
  type: 'learning';
  title: string;
  content: string;
  weekOfPregnancy: number;
  category: 'development' | 'nutrition' | 'exercise' | 'mental-health' | 'preparation';
  imageUrl?: string;
  readMoreUrl?: string;
}

export type Message = ChatMessage | SymptomMessage | LearningCardMessage;

// Attachment for messages
export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'audio' | 'video';
  url: string;
  name: string;
  size?: number;
  thumbnailUrl?: string;
}

// Symptom types
export type SymptomType = 
  | 'nausea' 
  | 'fatigue' 
  | 'headache' 
  | 'cramps' 
  | 'spotting'
  | 'contractions'
  | 'swelling'
  | 'backPain'
  | 'heartburn'
  | 'insomnia'
  | 'moodSwings'
  | 'other';

// User Context
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  dueDate?: string;
  lastPeriodDate?: string;
  currentWeekOfPregnancy?: number;
  pregnancyHistory?: {
    previousPregnancies: number;
    complications?: string[];
  };
  medicalConditions?: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  measurementSystem: 'metric' | 'imperial';
  privacySettings: {
    shareDataForResearch: boolean;
    allowPersonalization: boolean;
  };
}

// AI Response Types
export interface AIResponse {
  messageId: string;
  content: string;
  sources?: Source[];
  confidence?: number;
  followUpQuestions?: string[];
}

export interface Source {
  title: string;
  url?: string;
  publishDate?: string;
  authorOrganization?: string;
  snippet?: string;
  isScientific: boolean;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  background: string;
  surface: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    hint: string;
  };
  border: string;
  divider: string;
  action: {
    active: string;
    hover: string;
    selected: string;
    disabled: string;
    disabledBackground: string;
  };
}

export interface ThemeTypography {
  fontFamily: {
    regular: string;
    medium: string;
    semiBold: string;
    bold: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  lineHeight: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeShadows {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeBorderRadius {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  round: number;
}

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  shadows: ThemeShadows;
  borderRadius: ThemeBorderRadius;
  isDark: boolean;
} 