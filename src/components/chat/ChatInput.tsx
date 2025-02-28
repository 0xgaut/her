import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../contexts/ThemeContext';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');
  const { theme } = useThemeContext();

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }
    ]}>
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            borderColor: theme.colors.border
          }
        ]}
        value={message}
        onChangeText={setMessage}
        placeholder="Type your question..."
        placeholderTextColor={theme.colors.muted}
        multiline
        maxLength={1000}
      />
      <TouchableOpacity
        style={[
          styles.sendButton,
          { 
            backgroundColor: message.trim() ? theme.colors.primary : theme.colors.muted,
            opacity: message.trim() && !isLoading ? 1 : 0.7
          }
        ]}
        onPress={handleSend}
        disabled={!message.trim() || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Ionicons name="send" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    borderWidth: 1,
  },
  sendButton: {
    marginLeft: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ChatInput; 