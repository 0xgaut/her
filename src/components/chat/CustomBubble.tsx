import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Bubble, BubbleProps } from 'react-native-gifted-chat';
import { useAppTheme } from '../../hooks/useAppTheme';
import { CustomMessage } from './types';

interface CustomBubbleProps extends BubbleProps<CustomMessage> {
  onLongPress?: (context: any, message: CustomMessage) => void;
}

export const CustomBubble: React.FC<CustomBubbleProps> = (props) => {
  const { theme, isDark } = useAppTheme();
  const { currentMessage } = props;
  
  // Handle custom message types
  if (currentMessage?.customType && currentMessage.customType !== 'default') {
    // Render custom message types (symptom, learning, etc.)
    return renderCustomMessageType(props);
  }
  
  // Handle loading state
  if (currentMessage?.isLoading) {
    return (
      <View style={[
        styles.loadingBubble, 
        { backgroundColor: theme.colors.action.disabledBackground }
      ]}>
        <View style={styles.loadingDots}>
          <View style={[styles.dot, { backgroundColor: theme.colors.text.hint }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.text.hint, marginHorizontal: 4 }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.text.hint }]} />
        </View>
      </View>
    );
  }
  
  // Default bubble with custom styling
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...styles.leftBubble,
        },
        right: {
          backgroundColor: theme.colors.primary,
          ...styles.rightBubble,
        },
      }}
      textStyle={{
        left: {
          color: theme.colors.text.primary,
        },
        right: {
          color: '#FFFFFF',
        },
      }}
      timeTextStyle={{
        left: {
          color: theme.colors.text.hint,
        },
        right: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      }}
      renderTime={() => null} // We'll handle time display in a custom way
      renderTicks={() => {
        // Render message status indicators
        if (currentMessage?.user._id === props.user._id) {
          return renderMessageStatus(currentMessage.status, theme);
        }
        return null;
      }}
    />
  );
};

// Helper function to render custom message types
const renderCustomMessageType = (props: CustomBubbleProps) => {
  const { theme } = useAppTheme();
  const { currentMessage } = props;
  
  if (!currentMessage) return null;
  
  switch (currentMessage.customType) {
    case 'symptom':
      return (
        <View style={[styles.customBubble, { backgroundColor: theme.colors.info }]}>
          {/* Render symptom-specific content here */}
          {/* This would be expanded based on your app's requirements */}
        </View>
      );
    case 'learning':
      return (
        <View style={[styles.customBubble, { backgroundColor: theme.colors.success }]}>
          {/* Render learning card content here */}
          {/* This would be expanded based on your app's requirements */}
        </View>
      );
    default:
      return <Bubble {...props} />;
  }
};

// Helper function to render message status indicators
const renderMessageStatus = (status?: MessageStatus, theme?: any) => {
  if (!status) return null;
  
  const statusColor = {
    sending: theme.colors.text.hint,
    sent: theme.colors.info,
    received: theme.colors.success,
    read: theme.colors.success,
    error: theme.colors.error,
  };
  
  return (
    <View style={styles.statusContainer}>
      {/* Render appropriate status icon based on status */}
      <View style={[styles.statusDot, { backgroundColor: statusColor[status] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  leftBubble: {
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    marginBottom: 4,
  },
  rightBubble: {
    borderRadius: 16,
    borderBottomRightRadius: 4,
    marginBottom: 4,
  },
  loadingBubble: {
    padding: 10,
    borderRadius: 16,
    marginBottom: 4,
    marginLeft: 10,
    alignSelf: 'flex-start',
    maxWidth: '70%',
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.7,
  },
  customBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
    marginLeft: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  statusContainer: {
    marginRight: 5,
    alignSelf: 'flex-end',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 2,
  },
}); 