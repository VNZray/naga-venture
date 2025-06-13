import { ThemedText } from '@/components/ThemedText';
import { TouristSpotType } from '@/types/TouristSpot';
import { TouristSpotFormData } from '@/types/TouristSpotFormData';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface StepBasicsProps {
  data: TouristSpotFormData;
  setData: React.Dispatch<React.SetStateAction<TouristSpotFormData>>;
  errors: string[];
}

const categories = [
  'natural',
  'cultural',
  'historical',
  'religious',
  'recreational',
  'other',
] as const;

const StepSpotBasics: React.FC<StepBasicsProps> = ({
  data,
  setData,
  errors,
}) => {
  const isFieldError = (fieldName: string) => errors.includes(fieldName);

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          Tourist Spot Name <ThemedText style={{ color: 'red' }}>*</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, isFieldError('name') && styles.inputError]}
          value={data.name}
          onChangeText={(text) => setData({ ...data, name: text })}
          placeholder="Enter tourist spot name"
        />
        {isFieldError('name') && (
          <ThemedText style={styles.errorText}>Name is required</ThemedText>
        )}
      </View>

      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          Tourist Spot Type <ThemedText style={{ color: 'red' }}>*</ThemedText>
        </ThemedText>
        <View
          style={[
            styles.pickerContainer,
            isFieldError('spot_type') && styles.inputError,
          ]}
        >
          <Picker
            selectedValue={data.spot_type}
            onValueChange={(itemValue: string) =>
              setData({ ...data, spot_type: itemValue as TouristSpotType })
            }
            style={styles.picker}
          >
            {categories.map((category) => (
              <Picker.Item
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                value={category}
              />
            ))}
          </Picker>
        </View>
        {isFieldError('spot_type') && (
          <ThemedText style={styles.errorText}>
            Spot type is required
          </ThemedText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    color: '#000',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#000',
  },
});

export default StepSpotBasics;
