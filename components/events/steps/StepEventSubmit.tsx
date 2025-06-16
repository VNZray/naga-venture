import { ThemedText } from '@/components/ThemedText';
import { EventFormData } from '@/types/event';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface StepSubmitProps {
  data: EventFormData;
  setData: React.Dispatch<React.SetStateAction<EventFormData>>;
  errors: string[];
}

const StepEventSubmit: React.FC<StepSubmitProps> = ({ data, errors }) => {
  const isFieldError = (fieldName: string) => errors.includes(fieldName);

  const renderField = (label: string, value: string, fieldName: string) => (
    <View style={styles.fieldContainer}>
      <ThemedText type="subtitle" darkColor="#000">
        {label}{' '}
        {isFieldError(fieldName) && (
          <ThemedText style={{ color: 'red' }}>*</ThemedText>
        )}
      </ThemedText>
      <ThemedText
        style={[
          styles.fieldValue,
          isFieldError(fieldName) && styles.fieldError,
        ]}
      >
        {value || 'Not provided'}
      </ThemedText>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <ThemedText type="title" darkColor="#000" style={styles.sectionTitle}>
          Basic Information
        </ThemedText>
        {renderField('Name', data.name, 'name')}
        {renderField('Type', data.event_type, 'event_type')}
      </View>

      <View style={styles.section}>
        <ThemedText type="title" darkColor="#000" style={styles.sectionTitle}>
          Location
        </ThemedText>
        {renderField('Address', data.address, 'address')}
        {renderField('City', data.city, 'city')}
        {renderField('Province', data.province, 'province')}
        {renderField('Latitude', data.latitude, 'latitude')}
        {renderField('Longitude', data.longitude, 'longitude')}
      </View>

      <View style={styles.section}>
        <ThemedText type="title" darkColor="#000" style={styles.sectionTitle}>
          Contact Information
        </ThemedText>
        {renderField('Phone', data.contact_phone, 'contact_phone')}
        {renderField('Email', data.contact_email, 'contact_email')}
        {renderField('Website', data.website, 'website')}
      </View>

      <View style={styles.section}>
        <ThemedText type="title" darkColor="#000" style={styles.sectionTitle}>
          Description
        </ThemedText>
        {renderField('Description', data.description, 'description')}
      </View>

      <View style={styles.section}>
        <ThemedText type="title" darkColor="#000" style={styles.sectionTitle}>
          Additional Details
        </ThemedText>
        {renderField('Start Time', data.start_time, 'start_time')}
        {renderField('End Time', data.end_time, 'end_time')}
        {renderField('Entry Fee', data.entry_fee, 'entry_fee')}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldValue: {
    marginTop: 5,
    color: '#000',
  },
  fieldError: {
    color: 'red',
  },
});

export default StepEventSubmit; 