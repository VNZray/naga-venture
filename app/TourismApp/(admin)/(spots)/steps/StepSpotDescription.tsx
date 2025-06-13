import { TouristSpotFormData } from '@/types/TouristSpotFormData';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type StepDescriptionProps = {
  data: TouristSpotFormData;
  setData: React.Dispatch<React.SetStateAction<TouristSpotFormData>>;
};

const StepSpotDescription: React.FC<StepDescriptionProps> = ({
  data,
  setData,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Description</Text>

      <Text style={styles.label}>Tourist Spot Description</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={data.description}
        onChangeText={(text) =>
          setData((prev) => ({ ...prev, description: text }))
        }
        placeholder="Enter a brief description of the tourist spot"
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <View style={styles.detailsContainer}>
        <View style={styles.detailColumn}>
          <Text style={styles.label}>Opening Time</Text>
          <TextInput
            style={styles.input}
            value={data.opening_time}
            onChangeText={(text) =>
              setData((prev) => ({ ...prev, opening_time: text }))
            }
            placeholder="e.g., 08:00 AM"
          />

          <Text style={styles.label}>Closing Time</Text>
          <TextInput
            style={styles.input}
            value={data.closing_time}
            onChangeText={(text) =>
              setData((prev) => ({ ...prev, closing_time: text }))
            }
            placeholder="e.g., 05:00 PM"
          />
        </View>
        <View style={styles.detailColumn}>
          <Text style={styles.label}>Entry Fee</Text>
          <TextInput
            style={styles.input}
            value={data.entry_fee}
            onChangeText={(text) =>
              setData((prev) => ({ ...prev, entry_fee: text }))
            }
            placeholder="e.g., 100.00 (PHP)"
            keyboardType="numeric"
          />
        </View>
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
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 16,
  },
  detailColumn: {
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default StepSpotDescription;
