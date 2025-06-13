import { ThemedText } from '@/components/ThemedText';
import { TouristSpotFormData } from '@/types/TouristSpotFormData';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface StepContactProps {
  data: TouristSpotFormData;
  setData: React.Dispatch<React.SetStateAction<TouristSpotFormData>>;
  errors: string[];
}

const StepSpotContact: React.FC<StepContactProps> = ({
  data,
  setData,
  errors,
}) => {
  const isFieldError = (fieldName: string) => errors.includes(fieldName);

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          Contact Phone
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            isFieldError('contact_phone') && styles.inputError,
          ]}
          value={data.contact_phone}
          onChangeText={(text) => setData({ ...data, contact_phone: text })}
          placeholder="Enter contact phone number"
          keyboardType="phone-pad"
        />
        {isFieldError('contact_phone') && (
          <ThemedText style={styles.errorText}>
            Please enter a valid phone number
          </ThemedText>
        )}
      </View>

      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          Contact Email
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            isFieldError('contact_email') && styles.inputError,
          ]}
          value={data.contact_email}
          onChangeText={(text) => setData({ ...data, contact_email: text })}
          placeholder="Enter contact email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {isFieldError('contact_email') && (
          <ThemedText style={styles.errorText}>
            Please enter a valid email address
          </ThemedText>
        )}
      </View>

      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          Website
        </ThemedText>
        <TextInput
          style={[styles.input, isFieldError('website') && styles.inputError]}
          value={data.website}
          onChangeText={(text) => setData({ ...data, website: text })}
          placeholder="Enter website URL"
          keyboardType="url"
          autoCapitalize="none"
        />
        {isFieldError('website') && (
          <ThemedText style={styles.errorText}>
            Please enter a valid website URL
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
});

export default StepSpotContact;
