import PressableButton from '@/components/PressableButton';
import { BusinessFormData } from '@/types/BusinessFormData';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type StepBasicsProps = {
  data: BusinessFormData;
  setData: React.Dispatch<React.SetStateAction<BusinessFormData>>;
  onNext: () => void;
  onPrev: () => void;
};

const StepBasics: React.FC<StepBasicsProps> = ({
  data,
  setData,
  onNext,
  onPrev,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Basic Information</Text>

      <Text style={styles.label}>Business Name</Text>
      <TextInput
        style={styles.input}
        value={data.business_name}
        onChangeText={(text) =>
          setData((prev) => ({ ...prev, business_name: text }))
        }
        placeholder="Enter business name"
      />

      <Text style={styles.label}>Business Category</Text>

      <TextInput
        style={styles.input}
        value={data.category}
        onChangeText={(text) =>
          setData((prev) => ({ ...prev, category: text }))
        }
        placeholder="Business Category"
      />

      <Text style={styles.label}>Business Type</Text>
      <TextInput
        style={styles.input}
        value={data.business_type}
        onChangeText={(text) =>
          setData((prev) => ({ ...prev, business_type: text }))
        }
        placeholder="e.g. Restaurant, Hotel"
      />

      <View style={styles.buttonContainer}>
        <PressableButton
          type="primary"
          color="#fff"
          Title="Next"
          onPress={onNext}
          width={200}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 24,
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    gap: 24,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default StepBasics;
