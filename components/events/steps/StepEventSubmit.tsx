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
        {renderField('Start Date', data.start_date, 'start_date')}
        {renderField('Start Time', data.start_time, 'start_time')}
        {renderField('End Date', data.end_date, 'end_date')}
        {renderField('End Time', data.end_time, 'end_time')}
        {renderField('Entry Fee', data.entry_fee, 'entry_fee')}
      </View>

      <View style={styles.section}>
        <ThemedText type="title" darkColor="#000" style={styles.sectionTitle}>
          Permits & Clearances
        </ThemedText>
        <ThemedText style={styles.fieldValue}>
          Barangay Clearance: {data.permits?.barangay_clearance ? data.permits.barangay_clearance.name : 'Not uploaded'}
        </ThemedText>
        <ThemedText style={styles.fieldValue}>
          Mayor’s Special Permit: {data.permits?.mayor_special_permit ? data.permits.mayor_special_permit.name : 'Not uploaded'}
        </ThemedText>
        <ThemedText style={styles.fieldValue}>
          Fire Safety Inspection Certificate: {data.permits?.fire_safety_certificate ? data.permits.fire_safety_certificate.name : 'Not uploaded'}
        </ThemedText>
        <ThemedText style={styles.fieldValue}>
          Sanitary Permit: {data.permits?.sanitary_permit ? data.permits.sanitary_permit.name : 'Not uploaded'}
        </ThemedText>
        <ThemedText style={styles.fieldValue}>
          Locational/Zoning Clearance: {data.permits?.zoning_clearance ? data.permits.zoning_clearance.name : 'Not uploaded'}
        </ThemedText>
        <ThemedText style={styles.fieldValue}>
          Others: {data.permits?.others && data.permits.others.length > 0 ? `${data.permits.others.length} file(s)` : 'None'}
        </ThemedText>
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