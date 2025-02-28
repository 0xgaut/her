import { IMessage } from 'react-native-gifted-chat';
import { ChatMessage, Attachment } from '../../types/theme';

export type MessageStatus = 'sending' | 'sent' | 'received' | 'read' | 'error';

export interface CustomMessage extends IMessage {
  status?: MessageStatus;
  isTyping?: boolean;
  attachments?: Attachment[];
  customType?: 'symptom' | 'learning' | 'default';
  metadata?: Record<string, any>;
  isLoading?: boolean;
}

export interface ChatContainerProps {
  messages: CustomMessage[];
  onSend: (messages: CustomMessage[]) => void;
  user: { _id: string | number; name?: string; avatar?: string };
  isTyping?: boolean;
  loadEarlier?: boolean;
  onLoadEarlier?: () => void;
  isLoadingEarlier?: boolean;
  theme?: 'light' | 'dark';
  placeholder?: string;
  renderCustomMessage?: (props: any) => React.ReactNode;
  renderCustomBubble?: (props: any) => React.ReactNode;
  renderCustomInputToolbar?: (props: any) => React.ReactNode;
  renderCustomActions?: (props: any) => React.ReactNode;
  onPressAvatar?: (user: any) => void;
  onLongPressMessage?: (context: any, message: CustomMessage) => void;
  maxInputLength?: number;
  conversationId?: string;
  onAttachmentPress?: () => void;
  onCameraPress?: () => void;
  customStyles?: {
    container?: any;
    messageContainer?: any;
    inputToolbar?: any;
    sendButton?: any;
    bubbleLeft?: any;
    bubbleRight?: any;
    text?: any;
    time?: any;
  };
}

export interface ChatContextType {
  messages: CustomMessage[];
  setMessages: React.Dispatch<React.SetStateAction<CustomMessage[]>>;
  addMessage: (message: CustomMessage) => void;
  updateMessage: (id: string, updates: Partial<CustomMessage>) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  loadMessages: (conversationId: string) => Promise<void>;
  saveMessages: () => Promise<void>;
} 