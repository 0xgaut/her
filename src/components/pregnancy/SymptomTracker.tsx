import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { SymptomMessage, SymptomType } from '../../types/theme';

interface SymptomTrackerProps {
  symptom: SymptomMessage;
  onPress?: () => void;
}

const getSymptomLabel = (type: SymptomType): string => {
  const labels: Record<SymptomType, string> = {
    nausea: 'Nausea',
    fatigue: 'Fatigue',
    headache: 'Headache',
    cramps: 'Cramps',
    spotting: 'Spotting',
    contractions: 'Contractions',
    swelling: 'Swelling',
    backPain: 'Back Pain',
    heartburn: 'Heartburn',
    insomnia: 'Insomnia',
    moodSwings: 'Mood Swings',
    other: 'Other',
  };
  
  return labels[type] || 'Unknown';
};

const SymptomTracker: React.FC<SymptomTrackerProps> = ({ symptom, onPress }) => {
  const { styles, spacing, colors } = useAppTheme();
  
  return (
    <TouchableOpacity 
      style={styles.symptomTracker.container}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={styles.text.h3}>{getSymptomLabel(symptom.symptomType)}</Text>
      
      <View style={{ marginVertical: spacing.sm }}>
        <View style={{ 
          height: 8, 
          backgroundColor: colors.action.disabledBackground,
          borderRadius: 4,
          marginVertical: spacing.xs,
        }}>
          <View style={styles.symptomTracker.severityBar(symptom.severity)} />
        </View>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          marginTop: 2,
        }}>
          <Text style={styles.text.caption}>Mild</Text>
          <Text style={styles.text.caption}>Severe</Text>
        </View>
      </View>
      
      <Text style={styles.text.body2}>
        Duration: {symptom.duration} minutes
      </Text>
      
      {symptom.notes && (
        <Text style={[styles.text.body2, { marginTop: spacing.sm }]}>
          {symptom.notes}
        </Text>
      )}
      
      <Text style={[styles.text.caption, { marginTop: spacing.sm }]}>
        {new Date(symptom.timestamp).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );
};

export default SymptomTracker; 