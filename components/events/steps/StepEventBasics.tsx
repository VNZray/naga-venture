import { ThemedText } from '@/components/ThemedText';
import { EventCategory, EventFormData } from '@/types/event';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';

interface StepBasicsProps {
  data: EventFormData;
  setData: React.Dispatch<React.SetStateAction<EventFormData>>;
  errors: string[];
}

const categories = [
  'Cultural',
  'Food',
  'Adventure',
  'Religious',
  'Other',
] as const;

const StepEventBasics: React.FC<StepBasicsProps> = ({
  data,
  setData,
  errors,
}) => {
  const isFieldError = (fieldName: string) => errors.includes(fieldName);

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          Event Name <ThemedText style={{ color: 'red' }}>*</ThemedText>
        </ThemedText>
        <TextInput
          style={[styles.input, isFieldError('name') && styles.inputError]}
          value={data.name}
          onChangeText={(text) => setData({ ...data, name: text })}
          placeholder="Enter event name"
        />
        {isFieldError('name') && (
          <ThemedText style={styles.errorText}>Name is required</ThemedText>
        )}
      </View>

      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">
          Event Type <ThemedText style={{ color: 'red' }}>*</ThemedText>
        </ThemedText>
        <View
          style={[
            styles.pickerContainer,
            isFieldError('event_type') && styles.inputError,
          ]}
        >
          <Picker
            selectedValue={data.event_type}
            onValueChange={(itemValue: string) =>
              setData({ ...data, event_type: itemValue as EventCategory })
            }
            style={styles.picker}
          >
            {categories.map((category) => (
              <Picker.Item
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                value={category}
              />
            ))}
          </Picker>
        </View>
        {isFieldError('event_type') && (
          <ThemedText style={styles.errorText}>
            Event type is required
          </ThemedText>
        )}
      </View>
      <View style={styles.formGroup}>
        <ThemedText type="subtitle" darkColor="#000">Event Cover Image</ThemedText>
        {data.picture ? (
          <View style={styles.imageRow}>
            <Image source={{ uri: data.picture }} style={styles.imagePreview} />
            <Pressable
              style={styles.clearButton}
              onPress={() => setData({ ...data, picture: undefined })}
            >
              <ThemedText style={{ color: '#fff' }}>Remove</ThemedText>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.uploadButton}
            onPress={async () => {
              const res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
              });
              if (!res.canceled && res.assets && res.assets.length > 0) {
                const uri = res.assets[0].uri;
                setData({ ...data, picture: uri });
              }
            }}
          >
            <ThemedText style={styles.uploadButtonText}>Upload Image</ThemedText>
          </Pressable>
        )}
        <ThemedText style={styles.helperText}>JPEG/PNG recommended. Optional.</ThemedText>
      </View>
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeColumn}>
            <ThemedText type="subtitle" darkColor="#000">
              Start Date <ThemedText style={{ color: 'red' }}>*</ThemedText>
            </ThemedText>
            <input
              type="date"
              style={{ ...styles.input, width: '100%', boxSizing: 'border-box', height: 40, padding: 10, borderRadius: 5, border: isFieldError('start_date') ? '1px solid red' : '1px solid #ccc', color: '#000' }}
              value={data.start_date}
              onChange={e => setData({ ...data, start_date: e.target.value })}
            />
            {isFieldError('start_date') && (
              <ThemedText style={styles.errorText}>Start date is required</ThemedText>
            )}
          </View>
          <View style={styles.dateTimeColumn}>
            <ThemedText type="subtitle" darkColor="#000">
              End Date <ThemedText style={{ color: 'red' }}>*</ThemedText>
            </ThemedText>
            <input
              type="date"
              style={{ ...styles.input, width: '100%', boxSizing: 'border-box', height: 40, padding: 10, borderRadius: 5, border: isFieldError('end_date') ? '1px solid red' : '1px solid #ccc', color: '#000' }}
              value={data.end_date}
              onChange={e => setData({ ...data, end_date: e.target.value })}
            />
            {isFieldError('end_date') && (
              <ThemedText style={styles.errorText}>End date is required</ThemedText>
            )}
          </View>
        </View>
        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeColumn}>
            <ThemedText type="subtitle" darkColor="#000">
              Start Time <ThemedText style={{ color: 'red' }}>*</ThemedText>
            </ThemedText>
            <input
              type="time"
              style={{ ...styles.input, width: '100%', boxSizing: 'border-box', height: 40, padding: 10, borderRadius: 5, border: isFieldError('start_time') ? '1px solid red' : '1px solid #ccc', color: '#000' }}
              value={data.start_time}
              onChange={e => setData({ ...data, start_time: e.target.value })}
            />
            {isFieldError('start_time') && (
              <ThemedText style={styles.errorText}>Start time is required</ThemedText>
            )}
          </View>
          <View style={styles.dateTimeColumn}>
            <ThemedText type="subtitle" darkColor="#000">
              End Time <ThemedText style={{ color: 'red' }}>*</ThemedText>
            </ThemedText>
            <input
              type="time"
              style={{ ...styles.input, width: '100%', boxSizing: 'border-box', height: 40, padding: 10, borderRadius: 5, border: isFieldError('end_time') ? '1px solid red' : '1px solid #ccc', color: '#000' }}
              value={data.end_time}
              onChange={e => setData({ ...data, end_time: e.target.value })}
            />
            {isFieldError('end_time') && (
              <ThemedText style={styles.errorText}>End time is required</ThemedText>
            )}
          </View>
        </View>
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
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  imagePreview: {
    width: 120,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  uploadButton: {
    marginTop: 10,
    backgroundColor: '#0A1B47',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  uploadButtonText: {
    color: '#fff',
  },
  clearButton: {
    backgroundColor: '#B00020',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  helperText: {
    marginTop: 6,
    color: '#666',
    fontSize: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#000',
  },
  dateTimeContainer: {
    marginBottom: 20,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  dateTimeColumn: {
    flex: 1,
  },
});

export default StepEventBasics; 