import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatContextType, CustomMessage } from '../components/chat/types';
import { storageService } from '../services/storage/storageService';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode; conversationId?: string }> = ({ 
  children, 
  conversationId = 'default' 
}) => {
  const [messages, setMessages] = useState<CustomMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);

  // Load messages from storage when component mounts or conversationId changes
  useEffect(() => {
    if (conversationId !== currentConversationId) {
      setCurrentConversationId(conversationId);
    }
    loadMessages(conversationId);
  }, [conversationId]);

  // Save messages to storage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  const loadMessages = useCallback(async (convoId: string) => {
    try {
      const storedMessages = await storageService.getData<CustomMessage[]>(`chat_messages_${convoId}`);
      if (storedMessages) {
        setMessages(storedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  }, []);

  const saveMessages = useCallback(async () => {
    try {
      await storageService.storeData(`chat_messages_${currentConversationId}`, messages);
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }, [messages, currentConversationId]);

  const addMessage = useCallback((message: CustomMessage) => {
    setMessages(prevMessages => [message, ...prevMessages]);
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<CustomMessage>) => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message._id === id ? { ...message, ...updates } : message
      )
    );
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages(prevMessages => 
      prevMessages.filter(message => message._id !== id)
    );
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider value={{
      messages,
      setMessages,
      addMessage,
      updateMessage,
      deleteMessage,
      clearMessages,
      isTyping,
      setIsTyping,
      loadMessages,
      saveMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}; 