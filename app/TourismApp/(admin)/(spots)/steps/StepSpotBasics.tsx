import { TouristSpotType } from '@/types/TouristSpot';
import { TouristSpotFormData } from '@/types/TouristSpotFormData';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type StepBasicsProps = {
  data: TouristSpotFormData;
  setData: React.Dispatch<React.SetStateAction<TouristSpotFormData>>;
};

const categories: TouristSpotType[] = [
  'cultural',
  'historical',
  'natural',
  'other',
  'recreational',
  'religious',
];

const StepSpotBasics: React.FC<StepBasicsProps> = ({ data, setData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Basic Information</Text>

      <Text style={styles.label}>Tourist Spot Name</Text>
      <TextInput
        style={styles.input}
        value={data.name}
        onChangeText={(text) => setData((prev) => ({ ...prev, name: text }))}
        placeholder="Enter tourist spot name"
      />

      <Text style={styles.label}>Tourist Spot Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={data.spot_type}
          onValueChange={(itemValue: string) =>
            setData((prev) => ({
              ...prev,
              spot_type: itemValue as TouristSpotType,
            }))
          }
          style={styles.picker}
        >
          <Picker.Item label="Select a category" value="" />
          {categories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
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
    color: 'black',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default StepSpotBasics;
