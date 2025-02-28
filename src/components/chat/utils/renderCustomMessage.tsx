import React from 'react';
import { View } from 'react-native';
import { IMessage, MessageProps } from 'react-native-gifted-chat';
import { CustomMessage } from '../types';
import { SymptomTrackerMessage } from '../messages/SymptomTrackerMessage';
import { LearningCardMessage } from '../messages/LearningCardMessage';
import { QuickActionMessage, QuickAction } from '../messages/QuickActionMessage';

export const renderCustomMessage = (props: MessageProps<CustomMessage>) => {
  const { currentMessage, user } = props;
  
  if (!currentMessage) return null;
  
  const isOutgoing = currentMessage.user._id === user._id;
  
  // Check for custom message types
  if (currentMessage.customType) {
    switch (currentMessage.customType) {
      case 'symptom':
        return (
          <SymptomTrackerMessage
            isOutgoing={isOutgoing}
            onSubmit={(symptomType, severity, notes) => {
              // Handle symptom submission
              console.log('Symptom tracked:', { symptomType, severity, notes });
              // You would typically call an API or update state here
            }}
          />
        );
        
      case 'learning':
        if (currentMessage.metadata) {
          const { 
            title, 
            content, 
            imageUrl, 
            weekOfPregnancy, 
            category, 
            readMoreUrl, 
            progress 
          } = currentMessage.metadata;
          
          return (
            <LearningCardMessage
              title={title}
              content={content}
              imageUrl={imageUrl}
              weekOfPregnancy={weekOfPregnancy}
              category={category}
              readMoreUrl={readMoreUrl}
              progress={progress}
              isOutgoing={isOutgoing}
              onMarkAsRead={() => {
                // Handle marking as read
                console.log('Marked as read');
              }}
              onReadMore={(url) => {
                // Handle read more action
                console.log('Read more:', url);
              }}
              onSaveForLater={() => {
                // Handle save for later
                console.log('Saved for later');
              }}
            />
          );
        }
        break;
        
      default:
        // Handle other custom types or fall back to default
        break;
    }
  }
  
  // Check for quick actions in metadata
  if (currentMessage.metadata?.quickActions) {
    const { title, subtitle, actions, columns } = currentMessage.metadata.quickActions;
    
    return (
      <QuickActionMessage
        title={title}
        subtitle={subtitle}
        actions={actions}
        columns={columns}
        isOutgoing={isOutgoing}
        onDismiss={() => {
          // Handle dismissal
          console.log('Quick actions dismissed');
        }}
      />
    );
  }
  
  // Return null to let GiftedChat render the default message
  return null;
}; 