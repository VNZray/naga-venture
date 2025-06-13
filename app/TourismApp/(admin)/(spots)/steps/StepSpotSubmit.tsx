import { TouristSpotFormData } from '@/types/TouristSpotFormData';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type StepSubmitProps = {
  data: TouristSpotFormData;
  setData: React.Dispatch<React.SetStateAction<TouristSpotFormData>>;
};

const StepSpotSubmit: React.FC<StepSubmitProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Review and Submit</Text>
      <View style={styles.reviewContent}>
        <Text style={styles.label}>
          Name: <Text style={styles.value}>{data.name}</Text>
        </Text>
        <Text style={styles.label}>
          Type: <Text style={styles.value}>{data.spot_type}</Text>
        </Text>
        <Text style={styles.label}>
          Address:{' '}
          <Text style={styles.value}>
            {data.address}, {data.city}, {data.province}
          </Text>
        </Text>
        <Text style={styles.label}>
          Latitude: <Text style={styles.value}>{data.latitude}</Text>
        </Text>
        <Text style={styles.label}>
          Longitude: <Text style={styles.value}>{data.longitude}</Text>
        </Text>
        <Text style={styles.label}>
          Phone: <Text style={styles.value}>{data.contact_phone}</Text>
        </Text>
        <Text style={styles.label}>
          Email: <Text style={styles.value}>{data.contact_email}</Text>
        </Text>
        <Text style={styles.label}>
          Website: <Text style={styles.value}>{data.website}</Text>
        </Text>
        <Text style={styles.label}>
          Opening: <Text style={styles.value}>{data.opening_time}</Text>
        </Text>
        <Text style={styles.label}>
          Closing: <Text style={styles.value}>{data.closing_time}</Text>
        </Text>
        <Text style={styles.label}>
          Entry Fee: <Text style={styles.value}>{data.entry_fee}</Text>
        </Text>
        <Text style={styles.label}>
          Description: <Text style={styles.value}>{data.description}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  reviewContent: {
    marginBottom: 20,
    gap: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  value: {
    fontWeight: 'normal',
  },
});

export default StepSpotSubmit;
