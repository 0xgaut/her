import { DefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

export const Colors = {
  light: {
    primary: '#FF6B8B', // Soft pink
    secondary: '#7FC8F8', // Light blue
    background: '#FFFFFF',
    card: '#F9F9F9',
    text: '#333333',
    border: '#E0E0E0',
    notification: '#FF6B8B',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FFCC00',
    info: '#5AC8FA',
    accent: '#8A4FFF', // Purple accent
    muted: '#8E8E93',
  },
  dark: {
    primary: '#FF8FAA', // Lighter pink for dark mode
    secondary: '#64B5F6', // Adjusted blue for dark mode
    background: '#121212',
    card: '#1E1E1E',
    text: '#F0F0F0',
    border: '#2C2C2C',
    notification: '#FF8FAA',
    error: '#FF453A',
    success: '#30D158',
    warning: '#FFD60A',
    info: '#64D2FF',
    accent: '#A875FF', // Lighter purple for dark mode
    muted: '#6E6E73',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...Colors.light,
  },
  spacing: Spacing,
  fontSize: FontSizes,
  borderRadius: BorderRadius,
};

export const DarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...Colors.dark,
  },
  spacing: Spacing,
  fontSize: FontSizes,
  borderRadius: BorderRadius,
};

export function useTheme() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? DarkTheme : LightTheme;
} 