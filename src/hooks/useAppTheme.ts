import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { commonStyles } from '../theme/theme';

export const useAppTheme = () => {
  const { theme, themeType, setThemeType } = useContext(ThemeContext);
  
  return {
    theme,
    themeType,
    setThemeType,
    // Common component styles with theme applied
    styles: {
      card: commonStyles.card(theme),
      button: {
        primary: commonStyles.button.primary(theme),
        secondary: commonStyles.button.secondary(theme),
        outline: commonStyles.button.outline(theme),
        text: commonStyles.button.text(theme),
      },
      input: commonStyles.input(theme),
      messageBubble: {
        user: commonStyles.messageBubble.user(theme),
        assistant: commonStyles.messageBubble.assistant(theme),
        system: commonStyles.messageBubble.system(theme),
      },
      symptomTracker: {
        container: commonStyles.symptomTracker.container(theme),
        severityBar: (severity: number) => commonStyles.symptomTracker.severityBar(theme, severity),
      },
      learningCard: commonStyles.learningCard(theme),
      text: {
        h1: commonStyles.text.h1(theme),
        h2: commonStyles.text.h2(theme),
        h3: commonStyles.text.h3(theme),
        body1: commonStyles.text.body1(theme),
        body2: commonStyles.text.body2(theme),
        caption: commonStyles.text.caption(theme),
      },
    },
    // Helper functions
    isDark: theme.isDark,
    colors: theme.colors,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
  };
}; 