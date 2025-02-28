import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Text, ActivityIndicator } from 'react-native';
import { useThemeContext } from '../../contexts/ThemeContext';
import ChatMessage from '../../components/chat/ChatMessage';
import ChatInput from '../../components/chat/ChatInput';
import { aiService } from '../../services/ai/aiService';
import { storageService, ChatMessage as ChatMessageType } from '../../services/storage/storageService';
import { v4 as uuidv4 } from 'uuid';

const ChatScreen: React.FC = () => {
  const { theme } = useThemeContext();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChatHistory();
    checkApiKey();
  }, []);

  const loadChatHistory = async () => {
    const history = await storageService.getChatHistory();
    if (history) {
      setMessages(history);
    } else {
      // Add welcome message if no history
      const welcomeMessage: ChatMessageType = {
        id: uuidv4(),
        content: "Hello! I'm your pregnancy assistant. How can I help you today?",
        role: 'assistant',
        timestamp: Date.now()
      };
      setMessages([welcomeMessage]);
      await storageService.saveChatHistory([welcomeMessage]);
    }
  };

  const checkApiKey = async () => {
    const hasKey = await aiService.hasApiKey();
    setHasApiKey(hasKey);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Create and add user message
    const userMessage: ChatMessageType = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await storageService.saveChatHistory(updatedMessages);
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    if (!hasApiKey) {
      // Add message about missing API key
      const errorMessage: ChatMessageType = {
        id: uuidv4(),
        content: "Please set your OpenAI API key in the settings to enable AI responses.",
        role: 'system',
        timestamp: Date.now()
      };
      const messagesWithError = [...updatedMessages, errorMessage];
      setMessages(messagesWithError);
      await storageService.saveChatHistory(messagesWithError);
      return;
    }

    setIsLoading(true);

    try {
      // Get pregnancy data for context
      const pregnancyData = await storageService.getPregnancyData();
      
      // Format messages for AI
      const aiMessages = messages
        .filter(msg => msg.role !== 'system')
        .slice(-10) // Only use last 10 messages for context
        .map(msg => ({ role: msg.role, content: msg.content }));
      
      // Add user's new message
      aiMessages.push({ role: 'user', content });
      
      // Get AI response
      const response = await aiService.sendMessage(aiMessages);
      
      if (response) {
        const assistantMessage: ChatMessageType = {
          id: uuidv4(),
          content: response.content,
          role: 'assistant',
          timestamp: Date.now()
        };
        
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        await storageService.saveChatHistory(finalMessages);
        
        // Scroll to bottom again
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage: ChatMessageType = {
        id: uuidv4(),
        content: "Sorry, I couldn't process your request. Please try again later.",
        role: 'system',
        timestamp: Date.now()
      };
      
      const messagesWithError = [...updatedMessages, errorMessage];
      setMessages(messagesWithError);
      await storageService.saveChatHistory(messagesWithError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {messages.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChatMessage message={item} />}
          contentContainerStyle={styles.messageList}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen; 