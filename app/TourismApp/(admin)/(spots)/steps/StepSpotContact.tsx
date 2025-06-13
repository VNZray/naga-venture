import { TouristSpotFormData } from '@/types/TouristSpotFormData';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type StepContactProps = {
  data: TouristSpotFormData;
  setData: React.Dispatch<React.SetStateAction<TouristSpotFormData>>;
};

const StepSpotContact: React.FC<StepContactProps> = ({ data, setData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contact Information</Text>

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={data.contact_phone}
        onChangeText={(text) =>
          setData((prev) => ({ ...prev, contact_phone: text }))
        }
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={data.contact_email}
        onChangeText={(text) =>
          setData((prev) => ({ ...prev, contact_email: text }))
        }
        placeholder="Enter email address"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Website URL</Text>
      <TextInput
        style={styles.input}
        value={data.website}
        onChangeText={(text) => setData((prev) => ({ ...prev, website: text }))}
        placeholder="Enter website URL (optional)"
        autoCapitalize="none"
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

export default StepSpotContact;
