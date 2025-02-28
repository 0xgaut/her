import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { SymptomType } from '../../../types/theme';

interface SymptomTrackerMessageProps {
  onSubmit: (symptomType: SymptomType, severity: number, notes: string) => void;
  isOutgoing?: boolean;
}

const SYMPTOM_OPTIONS: Array<{ type: SymptomType; label: string; icon: string }> = [
  { type: 'nausea', label: 'Nausea', icon: 'medical' },
  { type: 'fatigue', label: 'Fatigue', icon: 'bed' },
  { type: 'headache', label: 'Headache', icon: 'fitness' },
  { type: 'cramps', label: 'Cramps', icon: 'body' },
  { type: 'spotting', label: 'Spotting', icon: 'water-outline' },
  { type: 'contractions', label: 'Contractions', icon: 'pulse' },
  { type: 'swelling', label: 'Swelling', icon: 'fitness' },
  { type: 'backPain', label: 'Back Pain', icon: 'body' },
  { type: 'heartburn', label: 'Heartburn', icon: 'flame' },
  { type: 'insomnia', label: 'Insomnia', icon: 'moon' },
  { type: 'moodSwings', label: 'Mood Swings', icon: 'happy' },
  { type: 'other', label: 'Other', icon: 'add-circle' },
];

export const SymptomTrackerMessage: React.FC<SymptomTrackerMessageProps> = ({ 
  onSubmit,
  isOutgoing = false,
}) => {
  const { theme, colors, spacing } = useAppTheme();
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomType | null>(null);
  const [severity, setSeverity] = useState<number>(3);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = () => {
    if (selectedSymptom) {
      onSubmit(selectedSymptom, severity, notes);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <View style={[
        styles.container, 
        { 
          backgroundColor: isOutgoing ? colors.primary : colors.surface,
          borderColor: isOutgoing ? 'transparent' : colors.border,
        }
      ]}>
        <Text style={[
          styles.title,
          { color: isOutgoing ? '#FFFFFF' : colors.text.primary }
        ]}>
          Symptom Recorded
        </Text>
        <View style={styles.confirmationContainer}>
          <Ionicons 
            name="checkmark-circle" 
            size={48} 
            color={isOutgoing ? '#FFFFFF' : colors.success} 
          />
          <Text style={[
            styles.confirmationText,
            { color: isOutgoing ? '#FFFFFF' : colors.text.primary }
          ]}>
            Your symptom has been tracked
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: isOutgoing ? colors.primary : colors.surface,
        borderColor: isOutgoing ? 'transparent' : colors.border,
      }
    ]}>
      <Text style={[
        styles.title,
        { color: isOutgoing ? '#FFFFFF' : colors.text.primary }
      ]}>
        Track a Symptom
      </Text>
      
      <Text style={[
        styles.subtitle,
        { color: isOutgoing ? 'rgba(255,255,255,0.8)' : colors.text.secondary }
      ]}>
        Select symptom:
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.symptomList}
      >
        {SYMPTOM_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.type}
            style={[
              styles.symptomOption,
              { 
                backgroundColor: selectedSymptom === option.type 
                  ? (isOutgoing ? 'rgba(255,255,255,0.3)' : colors.primaryLight) 
                  : (isOutgoing ? 'rgba(255,255,255,0.1)' : colors.background),
                borderColor: isOutgoing ? 'rgba(255,255,255,0.2)' : colors.border,
              }
            ]}
            onPress={() => setSelectedSymptom(option.type)}
          >
            <Ionicons 
              name={option.icon as any} 
              size={24} 
              color={isOutgoing ? '#FFFFFF' : colors.text.primary} 
            />
            <Text style={[
              styles.symptomLabel,
              { color: isOutgoing ? '#FFFFFF' : colors.text.primary }
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {selectedSymptom && (
        <>
          <Text style={[
            styles.subtitle,
            { 
              color: isOutgoing ? 'rgba(255,255,255,0.8)' : colors.text.secondary,
              marginTop: spacing.md,
            }
          ]}>
            Rate severity (1-5):
          </Text>
          
          <View style={styles.sliderContainer}>
            <Text style={[
              styles.sliderLabel,
              { color: isOutgoing ? 'rgba(255,255,255,0.7)' : colors.text.hint }
            ]}>
              Mild
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={severity}
              onValueChange={setSeverity}
              minimumTrackTintColor={isOutgoing ? '#FFFFFF' : colors.primary}
              maximumTrackTintColor={isOutgoing ? 'rgba(255,255,255,0.3)' : colors.border}
              thumbTintColor={isOutgoing ? '#FFFFFF' : colors.primary}
            />
            <Text style={[
              styles.sliderLabel,
              { color: isOutgoing ? 'rgba(255,255,255,0.7)' : colors.text.hint }
            ]}>
              Severe
            </Text>
          </View>
          
          <View style={styles.severityIndicator}>
            {[1, 2, 3, 4, 5].map((value) => (
              <View 
                key={value}
                style={[
                  styles.severityDot,
                  { 
                    backgroundColor: value <= severity 
                      ? (isOutgoing ? '#FFFFFF' : colors.primary) 
                      : (isOutgoing ? 'rgba(255,255,255,0.3)' : colors.border),
                    width: value === severity ? 16 : 10,
                    height: value === severity ? 16 : 10,
                  }
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity
            style={[
              styles.submitButton,
              { 
                backgroundColor: isOutgoing 
                  ? 'rgba(255,255,255,0.2)' 
                  : colors.primary,
              }
            ]}
            onPress={handleSubmit}
          >
            <Text style={[
              styles.submitButtonText,
              { color: '#FFFFFF' }
            ]}>
              Submit
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  symptomList: {
    paddingVertical: 8,
  },
  symptomOption: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  symptomLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderLabel: {
    fontSize: 12,
    width: 50,
  },
  severityIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  severityDot: {
    borderRadius: 8,
    marginHorizontal: 4,
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  confirmationText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
}); 