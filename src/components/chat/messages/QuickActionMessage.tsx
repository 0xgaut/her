import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/useAppTheme';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string; // Ionicons name
  color?: string;
  action: () => void;
}

interface QuickActionMessageProps {
  title?: string;
  subtitle?: string;
  actions: QuickAction[];
  columns?: 2 | 3 | 4;
  isOutgoing?: boolean;
  onDismiss?: () => void;
}

export const QuickActionMessage: React.FC<QuickActionMessageProps> = ({
  title = 'Quick Actions',
  subtitle,
  actions,
  columns = 3,
  isOutgoing = false,
  onDismiss,
}) => {
  const { theme, colors, spacing } = useAppTheme();
  const [dismissed, setDismissed] = React.useState(false);

  const handleDismiss = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (dismissed) {
    return null;
  }

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: isOutgoing ? colors.primary : colors.surface,
        borderColor: isOutgoing ? 'transparent' : colors.border,
      }
    ]}>
      <View style={styles.header}>
        <View>
          <Text style={[
            styles.title,
            { color: isOutgoing ? '#FFFFFF' : colors.text.primary }
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[
              styles.subtitle,
              { color: isOutgoing ? 'rgba(255,255,255,0.7)' : colors.text.secondary }
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
        {onDismiss && (
          <TouchableOpacity 
            style={styles.dismissButton} 
            onPress={handleDismiss}
          >
            <Ionicons 
              name="close" 
              size={20} 
              color={isOutgoing ? 'rgba(255,255,255,0.7)' : colors.text.secondary} 
            />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={actions}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.actionsContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { 
                backgroundColor: isOutgoing 
                  ? 'rgba(255,255,255,0.15)' 
                  : colors.background,
                borderColor: isOutgoing 
                  ? 'rgba(255,255,255,0.2)' 
                  : colors.border,
                width: `${100 / columns - 2}%`,
              }
            ]}
            onPress={item.action}
          >
            <View style={[
              styles.iconContainer,
              { 
                backgroundColor: item.color 
                  ? (isOutgoing ? 'rgba(255,255,255,0.2)' : item.color) 
                  : (isOutgoing ? 'rgba(255,255,255,0.2)' : colors.primaryLight),
              }
            ]}>
              <Ionicons 
                name={item.icon as any} 
                size={24} 
                color={isOutgoing 
                  ? '#FFFFFF' 
                  : (item.color ? '#FFFFFF' : colors.primary)
                } 
              />
            </View>
            <Text style={[
              styles.actionLabel,
              { color: isOutgoing ? '#FFFFFF' : colors.text.primary }
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
    maxWidth: '90%',
    alignSelf: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  dismissButton: {
    padding: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
}); 