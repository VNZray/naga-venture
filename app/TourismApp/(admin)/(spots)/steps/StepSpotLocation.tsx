import { TouristSpotFormData } from '@/types/TouristSpotFormData';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type StepLocationProps = {
  data: TouristSpotFormData;
  setData: React.Dispatch<React.SetStateAction<TouristSpotFormData>>;
};

const StepSpotLocation: React.FC<StepLocationProps> = ({ data, setData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Location Information</Text>

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={data.address}
        onChangeText={(text) => setData((prev) => ({ ...prev, address: text }))}
        placeholder="Enter street address"
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        value={data.city}
        onChangeText={(text) => setData((prev) => ({ ...prev, city: text }))}
        placeholder="Enter city"
      />

      <Text style={styles.label}>Province</Text>
      <TextInput
        style={styles.input}
        value={data.province}
        onChangeText={(text) =>
          setData((prev) => ({ ...prev, province: text }))
        }
        placeholder="Enter province"
      />

      <Text style={styles.label}>Latitude</Text>
      <TextInput
        style={styles.input}
        value={data.latitude}
        onChangeText={(text) =>
          setData((prev) => ({ ...prev, latitude: text }))
        }
        placeholder="Enter latitude"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Longitude</Text>
      <TextInput
        style={styles.input}
        value={data.longitude}
        onChangeText={(text) =>
          setData((prev) => ({ ...prev, longitude: text }))
        }
        placeholder="Enter longitude"
        keyboardType="numeric"
      />
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
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default StepSpotLocation;
