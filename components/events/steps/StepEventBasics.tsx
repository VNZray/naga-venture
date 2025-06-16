import { ThemedText } from '@/components/ThemedText';
import { EventCategory, EventFormData } from '@/types/event';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface StepBasicsProps {
  data: EventFormData;
  setData: React.Dispatch<React.SetStateAction<EventFormData>>;
  errors: string[];
}

const categories = [
  'Cultural',
  'Food',
  'Adventure',
  'Religious',
  'Other',
] as const;

const StepEventBasics: React.FC<StepBasicsProps> = ({
  data,
  setData,
  errors,
}) => {
  const isFieldError = (fieldName: string) => errors.includes(fieldName);

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          Event Name <ThemedText style={{ color: 'red' }}>*</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, isFieldError('name') && styles.inputError]}
          value={data.name}
          onChangeText={(text) => setData({ ...data, name: text })}
          placeholder="Enter event name"
        />
        {isFieldError('name') && (
          <ThemedText style={styles.errorText}>Name is required</ThemedText>
        )}
      </View>

      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          Event Type <ThemedText style={{ color: 'red' }}>*</ThemedText>
        </ThemedText>
        <View
          style={[
            styles.pickerContainer,
            isFieldError('event_type') && styles.inputError,
          ]}
        >
          <Picker
            selectedValue={data.event_type}
            onValueChange={(itemValue: string) =>
              setData({ ...data, event_type: itemValue as EventCategory })
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
        {isFieldError('event_type') && (
          <ThemedText style={styles.errorText}>
            Event type is required
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

export default StepEventBasics; 