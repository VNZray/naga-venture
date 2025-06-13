import PressableButton from '@/components/PressableButton';
import { Business } from '@/types/Business';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type StepLocationProps = {
  data: Business;
  setData: React.Dispatch<React.SetStateAction<Business>>;
  onNext: () => void;
  onPrev: () => void;
};

const StepLocation: React.FC<StepLocationProps> = ({
  data,
  setData,
  onNext,
  onPrev,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Business Address</Text>

      <Text style={styles.label}>Barangay</Text>
      <TextInput
        style={styles.input}
        value={data.barangay}
        onChangeText={(text) =>
          setData((prev) => ({ ...prev, barangay: text }))
        }
        placeholder="Enter Barangay"
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        value={data.city}
        onChangeText={(text) => setData((prev) => ({ ...prev, city: text }))}
        placeholder="Enter City"
      />

      <Text style={styles.label}>Province</Text>
      <TextInput
        style={styles.input}
        value={data.province}
        onChangeText={(text) =>
          setData((prev) => ({ ...prev, province: text }))
        }
        placeholder="Enter Province"
      />

      <Text style={styles.label}>Postal Code</Text>
      <TextInput
        style={styles.input}
        value={data.postal_code}
        onChangeText={(text) =>
          setData((prev) => ({ ...prev, postal_code: text }))
        }
        placeholder="Enter Postal Code"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Longitude</Text>
      <TextInput
        style={styles.input}
        value={data.longitude}
        onChangeText={(text) =>
          setData((prev) => ({ ...prev, longitude: text }))
        }
        placeholder="Enter Longitude"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Latitude</Text>
      <TextInput
        style={styles.input}
        value={data.latitude}
        onChangeText={(text) =>
          setData((prev) => ({ ...prev, latitude: text }))
        }
        placeholder="Enter Latitude"
        keyboardType="decimal-pad"
      />

      <View style={styles.buttonContainer}>
        <PressableButton
          type="cancel"
          color="#fff"
          Title="Prev"
          onPress={onPrev}
          width={200}
        />
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
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 24,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default StepLocation;
