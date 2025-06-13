import { ThemedText } from '@/components/ThemedText';
import { TouristSpotFormData } from '@/types/TouristSpotFormData';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface StepLocationProps {
  data: TouristSpotFormData;
  setData: React.Dispatch<React.SetStateAction<TouristSpotFormData>>;
  errors: string[];
}

const StepSpotLocation: React.FC<StepLocationProps> = ({
  data,
  setData,
  errors,
}) => {
  const isFieldError = (fieldName: string) => errors.includes(fieldName);

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          Address <ThemedText style={{ color: 'red' }}>*</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, isFieldError('address') && styles.inputError]}
          value={data.address}
          onChangeText={(text) => setData({ ...data, address: text })}
          placeholder="Enter address"
        />
        {isFieldError('address') && (
          <ThemedText style={styles.errorText}>Address is required</ThemedText>
        )}
      </View>

      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          City <ThemedText style={{ color: 'red' }}>*</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, isFieldError('city') && styles.inputError]}
          value={data.city}
          onChangeText={(text) => setData({ ...data, city: text })}
          placeholder="Enter city"
        />
        {isFieldError('city') && (
          <ThemedText style={styles.errorText}>City is required</ThemedText>
        )}
      </View>

      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          Province <ThemedText style={{ color: 'red' }}>*</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, isFieldError('province') && styles.inputError]}
          value={data.province}
          onChangeText={(text) => setData({ ...data, province: text })}
          placeholder="Enter province"
        />
        {isFieldError('province') && (
          <ThemedText style={styles.errorText}>Province is required</ThemedText>
        )}
      </View>

      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          Latitude <ThemedText style={{ color: 'red' }}>*</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, isFieldError('latitude') && styles.inputError]}
          value={data.latitude}
          onChangeText={(text) => setData({ ...data, latitude: text })}
          placeholder="Enter latitude"
          keyboardType="numeric"
        />
        {isFieldError('latitude') && (
          <ThemedText style={styles.errorText}>
            {errors.includes('latitude')
              ? 'Valid latitude is required (-90 to 90)'
              : 'Latitude is required'}
          </ThemedText>
        )}
      </View>

      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          Longitude <ThemedText style={{ color: 'red' }}>*</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, isFieldError('longitude') && styles.inputError]}
          value={data.longitude}
          onChangeText={(text) => setData({ ...data, longitude: text })}
          placeholder="Enter longitude"
          keyboardType="numeric"
        />
        {isFieldError('longitude') && (
          <ThemedText style={styles.errorText}>
            {errors.includes('longitude')
              ? 'Valid longitude is required (-180 to 180)'
              : 'Longitude is required'}
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

export default StepSpotLocation;
