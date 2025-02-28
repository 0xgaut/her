import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { InputToolbar, InputToolbarProps, Composer, Send } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { CustomMessage } from './types';

interface CustomInputToolbarProps extends InputToolbarProps<CustomMessage> {
  onAttachmentPress?: () => void;
  onCameraPress?: () => void;
  maxInputLength?: number;
  placeholder?: string;
}

export const CustomInputToolbar: React.FC<CustomInputToolbarProps> = (props) => {
  const { theme, isDark } = useAppTheme();
  const [text, setText] = useState('');
  
  const handleTextChange = (newText: string) => {
    setText(newText);
    if (props.onInputTextChanged) {
      props.onInputTextChanged(newText);
    }
  };
  
  const handleSend = () => {
    if (props.onSend && text.trim()) {
      props.onSend({ text: text.trim() }, true);
      setText('');
    }
  };
  
  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: theme.colors.background,
        borderTopColor: theme.colors.border,
      }
    ]}>
      <View style={styles.actionsContainer}>
        {props.onAttachmentPress && (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={props.onAttachmentPress}
          >
            <Ionicons 
              name="attach" 
              size={24} 
              color={theme.colors.text.secondary} 
            />
          </TouchableOpacity>
        )}
        
        {props.onCameraPress && (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={props.onCameraPress}
          >
            <Ionicons 
              name="camera" 
              size={24} 
              color={theme.colors.text.secondary} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={[
        styles.inputContainer,
        { 
          backgroundColor: isDark ? theme.colors.surface : theme.colors.background,
          borderColor: theme.colors.border,
        }
      ]}>
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text.primary }
          ]}
          placeholder={props.placeholder || "Type a message..."}
          placeholderTextColor={theme.colors.text.hint}
          value={text}
          onChangeText={handleTextChange}
          multiline
          maxLength={props.maxInputLength}
        />
      </View>
      
      <TouchableOpacity 
        style={[
          styles.sendButton,
          { 
            backgroundColor: text.trim() ? theme.colors.primary : theme.colors.action.disabledBackground,
            opacity: text.trim() ? 1 : 0.5,
          }
        ]} 
        onPress={handleSend}
        disabled={!text.trim()}
      >
        <Ionicons 
          name="send" 
          size={20} 
          color={text.trim() ? '#FFFFFF' : theme.colors.text.disabled} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  iconButton: {
    padding: 8,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    marginRight: 8,
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 