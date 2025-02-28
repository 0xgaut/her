import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { ChatMessage as ChatMessageType } from '../../types/theme';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { styles, colors } = useAppTheme();
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <View style={[
      isUser ? styles.messageBubble.user : 
      isSystem ? styles.messageBubble.system : 
      styles.messageBubble.assistant
    ]}>
      <Text style={{
        color: isUser ? '#fff' : colors.text.primary,
        ...styles.text.body1,
      }}>
        {message.content}
      </Text>
      <Text style={{
        color: isUser ? 'rgba(255, 255, 255, 0.7)' : colors.text.hint,
        ...styles.text.caption,
        alignSelf: 'flex-end',
        marginTop: 4,
      }}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

export default ChatMessage; 