import { Dimensions } from 'react-native';
import { Theme, ThemeColors, ThemeTypography, ThemeSpacing, ThemeShadows, ThemeBorderRadius } from '../types/theme';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

// Color Palette
const palette = {
  // Purple shades (primary)
  purple100: '#F3EAFF',
  purple200: '#E1CCFF',
  purple300: '#C9A6FF',
  purple400: '#B184FD',
  purple500: '#9966FF', // Primary
  purple600: '#7F4FD6',
  purple700: '#6639AD',
  purple800: '#4D2680',
  purple900: '#331A52',

  // Teal shades (secondary)
  teal100: '#E0F7F6',
  teal200: '#B3ECE9',
  teal300: '#80DEDB',
  teal400: '#4DD0CD',
  teal500: '#26C6C2', // Secondary
  teal600: '#1FA19E',
  teal700: '#197D7A',
  teal800: '#125A58',
  teal900: '#0C3736',

  // Neutrals
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  black: '#000000',

  // Feedback colors
  red500: '#EF4444', // Error
  amber500: '#F59E0B', // Warning
  green500: '#10B981', // Success
  blue500: '#3B82F6', // Info
};

// Light Theme Colors
const lightColors: ThemeColors = {
  primary: palette.purple500,
  primaryLight: palette.purple300,
  primaryDark: palette.purple700,
  secondary: palette.teal500,
  secondaryLight: palette.teal300,
  secondaryDark: palette.teal700,
  background: palette.white,
  surface: palette.gray50,
  error: palette.red500,
  warning: palette.amber500,
  success: palette.green500,
  info: palette.blue500,
  text: {
    primary: palette.gray900,
    secondary: palette.gray700,
    disabled: palette.gray400,
    hint: palette.gray500,
  },
  border: palette.gray200,
  divider: palette.gray200,
  action: {
    active: palette.purple500,
    hover: palette.purple100,
    selected: palette.purple200,
    disabled: palette.gray300,
    disabledBackground: palette.gray100,
  },
};

// Dark Theme Colors
const darkColors: ThemeColors = {
  primary: palette.purple400,
  primaryLight: palette.purple300,
  primaryDark: palette.purple600,
  secondary: palette.teal400,
  secondaryLight: palette.teal300,
  secondaryDark: palette.teal600,
  background: palette.gray900,
  surface: palette.gray800,
  error: palette.red500,
  warning: palette.amber500,
  success: palette.green500,
  info: palette.blue500,
  text: {
    primary: palette.white,
    secondary: palette.gray300,
    disabled: palette.gray500,
    hint: palette.gray400,
  },
  border: palette.gray700,
  divider: palette.gray700,
  action: {
    active: palette.purple400,
    hover: palette.purple900,
    selected: palette.purple800,
    disabled: palette.gray600,
    disabledBackground: palette.gray800,
  },
};

// Typography
const typography: ThemeTypography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: isSmallDevice ? 10 : 12,
    sm: isSmallDevice ? 12 : 14,
    md: isSmallDevice ? 14 : 16,
    lg: isSmallDevice ? 16 : 18,
    xl: isSmallDevice ? 18 : 20,
    xxl: isSmallDevice ? 20 : 24,
    xxxl: isSmallDevice ? 24 : 30,
  },
  lineHeight: {
    xs: isSmallDevice ? 14 : 16,
    sm: isSmallDevice ? 18 : 20,
    md: isSmallDevice ? 20 : 24,
    lg: isSmallDevice ? 24 : 28,
    xl: isSmallDevice ? 26 : 30,
    xxl: isSmallDevice ? 30 : 36,
    xxxl: isSmallDevice ? 36 : 42,
  },
};

// Spacing
const spacing: ThemeSpacing = {
  xs: isSmallDevice ? 4 : 4,
  sm: isSmallDevice ? 6 : 8,
  md: isSmallDevice ? 12 : 16,
  lg: isSmallDevice ? 18 : 24,
  xl: isSmallDevice ? 24 : 32,
  xxl: isSmallDevice ? 32 : 48,
};

// Shadows
const shadows: ThemeShadows = {
  none: 'none',
  xs: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

// Border Radius
const borderRadius: ThemeBorderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

// Light Theme
export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  shadows,
  borderRadius,
  isDark: false,
};

// Dark Theme
export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  shadows,
  borderRadius,
  isDark: true,
};

// Common Component Styles
export const commonStyles = {
  // Card styles
  card: (theme: Theme) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 3,
    elevation: 3,
  }),

  // Button styles
  button: {
    primary: (theme: Theme) => ({
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    }),
    secondary: (theme: Theme) => ({
      backgroundColor: theme.colors.secondary,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    }),
    outline: (theme: Theme) => ({
      backgroundColor: 'transparent',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    }),
    text: (theme: Theme) => ({
      backgroundColor: 'transparent',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    }),
  },

  // Input styles
  input: (theme: Theme) => ({
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  }),

  // Message bubble styles
  messageBubble: {
    user: (theme: Theme) => ({
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      borderBottomRightRadius: theme.borderRadius.xs,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      maxWidth: '80%',
      alignSelf: 'flex-end',
    }),
    assistant: (theme: Theme) => ({
      backgroundColor: theme.isDark ? theme.colors.surface : theme.colors.gray100,
      borderRadius: theme.borderRadius.lg,
      borderBottomLeftRadius: theme.borderRadius.xs,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      maxWidth: '80%',
      alignSelf: 'flex-start',
    }),
    system: (theme: Theme) => ({
      backgroundColor: theme.colors.info,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      maxWidth: '90%',
      alignSelf: 'center',
    }),
  },

  // Symptom tracker styles
  symptomTracker: {
    container: (theme: Theme) => ({
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.sm,
    }),
    severityBar: (theme: Theme, severity: number) => {
      let color = theme.colors.success;
      if (severity > 3 && severity <= 6) color = theme.colors.warning;
      if (severity > 6) color = theme.colors.error;
      
      return {
        height: 8,
        width: `${severity * 10}%`,
        backgroundColor: color,
        borderRadius: theme.borderRadius.xs,
      };
    },
  },

  // Learning card styles
  learningCard: (theme: Theme) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginVertical: theme.spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 3,
    elevation: 3,
  }),

  // Typography styles
  text: {
    h1: (theme: Theme) => ({
      fontSize: theme.typography.fontSize.xxxl,
      lineHeight: theme.typography.lineHeight.xxxl,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
    }),
    h2: (theme: Theme) => ({
      fontSize: theme.typography.fontSize.xxl,
      lineHeight: theme.typography.lineHeight.xxl,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
    }),
    h3: (theme: Theme) => ({
      fontSize: theme.typography.fontSize.xl,
      lineHeight: theme.typography.lineHeight.xl,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
    }),
    body1: (theme: Theme) => ({
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.lineHeight.md,
      color: theme.colors.text.primary,
    }),
    body2: (theme: Theme) => ({
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
      color: theme.colors.text.secondary,
    }),
    caption: (theme: Theme) => ({
      fontSize: theme.typography.fontSize.xs,
      lineHeight: theme.typography.lineHeight.xs,
      color: theme.colors.text.hint,
    }),
  },
};

// Helper function to get the current theme
export const getTheme = (isDarkMode: boolean): Theme => {
  return isDarkMode ? darkTheme : lightTheme;
}; 