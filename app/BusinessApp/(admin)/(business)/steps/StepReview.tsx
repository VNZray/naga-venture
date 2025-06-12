import PressableButton from '@/components/PressableButton';
import { BusinessFormData } from '@/types/BusinessFormData';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type StepBasicsProps = {
  data: BusinessFormData;
  setData: React.Dispatch<React.SetStateAction<BusinessFormData>>;
  onNext: () => void;
  onPrev: () => void;
};

const StepReview: React.FC<StepBasicsProps> = ({ data, onNext, onPrev }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Review Your Business Information</Text>
      <View style={styles.table}>
        {Object.entries(data).map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.cellLabel}>{key.replace(/_/g, ' ')}</Text>
            <Text style={styles.cellValue}>{value || 'N/A'}</Text>
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <PressableButton
          type="cancel"
          color="#fff"
          Title="Prev"
          onPress={onPrev}
          width={200}
        />
        <PressableButton
          type="primary"
          color="#fff"
          Title="Next"
          onPress={onNext}
          width={200}
        />
      </View>
    </ScrollView>
  );
};

export default StepReview;

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  table: { marginBottom: 24 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  cellLabel: {
    fontWeight: 'bold',
    flex: 1,
    textTransform: 'capitalize',
    color: '#333',
  },
  cellValue: {
    flex: 1,
    textAlign: 'left',
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
  },
});
