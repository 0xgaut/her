import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { MessageImage, MessageImageProps } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { CustomMessage } from './types';
import * as ImagePicker from 'expo-image-picker';

interface CustomMessageImageProps extends MessageImageProps<CustomMessage> {
  onImagePress?: (uri: string) => void;
}

export const CustomMessageImage: React.FC<CustomMessageImageProps> = (props) => {
  const { theme } = useAppTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const { width } = Dimensions.get('window');
  const MAX_IMAGE_WIDTH = width * 0.7;
  
  const handleImagePress = () => {
    if (props.onImagePress && props.currentMessage?.image) {
      props.onImagePress(props.currentMessage.image);
    }
  };
  
  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };
  
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  
  if (!props.currentMessage?.image) {
    return null;
  }
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handleImagePress}
      activeOpacity={0.8}
    >
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary} size="small" />
        </View>
      )}
      
      {hasError ? (
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.error }]}>
          <Ionicons name="alert-circle" size={24} color="#FFFFFF" />
        </View>
      ) : (
        <Image
          source={{ uri: props.currentMessage.image }}
          style={[
            styles.image,
            { maxWidth: MAX_IMAGE_WIDTH }
          ]}
          onLoadStart={() => setIsLoading(true)}
          onLoad={handleImageLoad}
          onError={handleImageError}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 3,
    borderRadius: 13,
    overflow: 'hidden',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 13,
  },
  loadingContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 13,
  },
  errorContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
  },
}); 