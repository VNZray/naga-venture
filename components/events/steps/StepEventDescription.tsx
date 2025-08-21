import { ThemedText } from '@/components/ThemedText';
import { EventFormData } from '@/types/event';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface StepDescriptionProps {
  data: EventFormData;
  setData: React.Dispatch<React.SetStateAction<EventFormData>>;
  errors: string[];
}

const StepEventDescription: React.FC<StepDescriptionProps> = ({
  data,
  setData,
  errors,
}) => {
  const isFieldError = (fieldName: string) => errors.includes(fieldName);

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          Description <ThemedText style={{ color: 'red' }}>*</ThemedText>
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            isFieldError('description') && styles.inputError,
          ]}
          value={data.description}
          onChangeText={(text) => setData({ ...data, description: text })}
          placeholder="Enter description"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        {isFieldError('description') && (
          <ThemedText style={styles.errorText}>
            Description is required
          </ThemedText>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailColumn}>
          <ThemedText type="subtitle" darkColor="#000">
            Entry Fee
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              isFieldError('entry_fee') && styles.inputError,
            ]}
            value={data.entry_fee}
            onChangeText={(text) => setData({ ...data, entry_fee: text })}
            placeholder="e.g., 100.00 (PHP)"
            keyboardType="numeric"
          />
          {isFieldError('entry_fee') && (
            <ThemedText style={styles.errorText}>
              Please enter a valid amount
            </ThemedText>
          )}
        </View>
        <View style={styles.detailColumn}>
          <ThemedText type="subtitle" darkColor="#000">
            Social Media Links
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              isFieldError('social_media') && styles.inputError,
            ]}
            value={data.social_media}
            onChangeText={(text) => setData({ ...data, social_media: text })}
            placeholder="Facebook, Instagram, etc."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {isFieldError('social_media') && (
            <ThemedText style={styles.errorText}>
              Please enter social media links
            </ThemedText>
          )}
        </View>
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
  textArea: {
    height: 100,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  detailColumn: {
    flex: 1,
  },
  fieldSpacing: {
    marginTop: 20,
  },
});

export default StepEventDescription; 