import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Animated, 
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

interface LearningCardMessageProps {
  title: string;
  content: string;
  imageUrl?: string;
  weekOfPregnancy: number;
  category: 'development' | 'nutrition' | 'exercise' | 'mental-health' | 'preparation';
  readMoreUrl?: string;
  progress?: number; // 0-100
  onMarkAsRead?: () => void;
  onReadMore?: (url: string) => void;
  onSaveForLater?: () => void;
  isOutgoing?: boolean;
}

export const LearningCardMessage: React.FC<LearningCardMessageProps> = ({
  title,
  content,
  imageUrl,
  weekOfPregnancy,
  category,
  readMoreUrl,
  progress = 0,
  onMarkAsRead,
  onReadMore,
  onSaveForLater,
  isOutgoing = false,
}) => {
  const { theme, colors, spacing } = useAppTheme();
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [read, setRead] = useState(progress === 100);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleMarkAsRead = () => {
    setRead(true);
    if (onMarkAsRead) {
      onMarkAsRead();
    }
  };

  const handleSaveForLater = () => {
    setSaved(!saved);
    if (onSaveForLater) {
      onSaveForLater();
    }
  };

  const handleReadMore = () => {
    if (readMoreUrl && onReadMore) {
      onReadMore(readMoreUrl);
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'development': return 'body';
      case 'nutrition': return 'nutrition';
      case 'exercise': return 'fitness';
      case 'mental-health': return 'happy';
      case 'preparation': return 'list-circle';
      default: return 'information-circle';
    }
  };

  const getCategoryColor = () => {
    if (isOutgoing) return '#FFFFFF';
    
    switch (category) {
      case 'development': return colors.primary;
      case 'nutrition': return colors.success;
      case 'exercise': return colors.info;
      case 'mental-health': return colors.secondary;
      case 'preparation': return colors.warning;
      default: return colors.primary;
    }
  };

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: isOutgoing ? colors.primary : colors.surface,
        borderColor: isOutgoing ? 'transparent' : colors.border,
      }
    ]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor() }
          ]}>
            <Ionicons 
              name={getCategoryIcon() as any} 
              size={14} 
              color={isOutgoing ? colors.primary : '#FFFFFF'} 
            />
          </View>
          <Text style={[
            styles.title,
            { color: isOutgoing ? '#FFFFFF' : colors.text.primary }
          ]}>
            {title}
          </Text>
        </View>
        <TouchableOpacity onPress={toggleExpanded}>
          <Ionicons 
            name={expanded ? 'chevron-up' : 'chevron-down'} 
            size={24} 
            color={isOutgoing ? '#FFFFFF' : colors.text.primary} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.weekBadge}>
        <Text style={[
          styles.weekText,
          { color: isOutgoing ? colors.primary : '#FFFFFF' }
        ]}>
          Week {weekOfPregnancy}
        </Text>
      </View>

      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {expanded && (
        <View style={styles.contentContainer}>
          <Text style={[
            styles.content,
            { color: isOutgoing ? 'rgba(255,255,255,0.9)' : colors.text.primary }
          ]}>
            {content}
          </Text>

          <View style={styles.actionButtons}>
            {readMoreUrl && (
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  { 
                    backgroundColor: isOutgoing 
                      ? 'rgba(255,255,255,0.2)' 
                      : colors.primary,
                  }
                ]}
                onPress={handleReadMore}
              >
                <Text style={[
                  styles.actionButtonText,
                  { color: '#FFFFFF' }
                ]}>
                  Read More
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[
                styles.iconButton,
                { 
                  backgroundColor: saved
                    ? (isOutgoing ? 'rgba(255,255,255,0.3)' : colors.primaryLight)
                    : 'transparent',
                }
              ]}
              onPress={handleSaveForLater}
            >
              <Ionicons 
                name={saved ? 'bookmark' : 'bookmark-outline'} 
                size={20} 
                color={isOutgoing ? '#FFFFFF' : colors.primary} 
              />
            </TouchableOpacity>

            {!read && (
              <TouchableOpacity 
                style={[
                  styles.iconButton,
                  { 
                    backgroundColor: 'transparent',
                  }
                ]}
                onPress={handleMarkAsRead}
              >
                <Ionicons 
                  name="checkmark-circle-outline" 
                  size={20} 
                  color={isOutgoing ? '#FFFFFF' : colors.text.secondary} 
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <View style={[
          styles.progressBarContainer,
          { backgroundColor: isOutgoing ? 'rgba(255,255,255,0.2)' : colors.border }
        ]}>
          <View 
            style={[
              styles.progressBar,
              { 
                width: `${progress}%`,
                backgroundColor: isOutgoing ? '#FFFFFF' : colors.success,
              }
            ]} 
          />
        </View>
        <Text style={[
          styles.progressText,
          { color: isOutgoing ? 'rgba(255,255,255,0.7)' : colors.text.hint }
        ]}>
          {read ? 'Read' : `${progress}% complete`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 8,
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  weekBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  weekText: {
    fontSize: 12,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 150,
  },
  contentContainer: {
    padding: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  footer: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    height: 4,
    borderRadius: 2,
    flex: 1,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
  },
}); 