import { ThemedText } from '@/components/ThemedText';
import { EventFormData } from '@/types/event';
import React from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

interface StepLocationProps {
  data: EventFormData;
  setData: React.Dispatch<React.SetStateAction<EventFormData>>;
  errors: string[];
}

const StepEventLocation: React.FC<StepLocationProps> = ({
  data,
  setData,
  errors,
}) => {
  const isFieldError = (fieldName: string) => errors.includes(fieldName);
  const latitude = parseFloat(data.latitude as string);
  const longitude = parseFloat(data.longitude as string);
  const hasValidLat = !isNaN(latitude) && latitude >= -90 && latitude <= 90;
  const hasValidLng = !isNaN(longitude) && longitude >= -180 && longitude <= 180;
  const showMap = Platform.OS === 'web' && hasValidLat && hasValidLng;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle} darkColor="#fff">Location</ThemedText>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
        <View style={styles.formColumn}>
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

          <View style={styles.additionalContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedText type="subtitle" darkColor="#000">Additional Locations (Optional)</ThemedText>
              <Pressable
                style={styles.addButton}
                onPress={() =>
                  setData({
                    ...data,
                    additional_locations: [
                      ...(data.additional_locations || []),
                      { address: '', latitude: data.latitude || '', longitude: data.longitude || '' },
                    ],
                  })
                }
              >
                <ThemedText style={{ color: '#fff' }}>+ Add</ThemedText>
              </Pressable>
            </View>

            {(data.additional_locations || []).map((loc, index) => (
              <View key={index} style={styles.additionalRow}>
                <TextInput
                  style={[styles.input, { flex: 2, marginRight: 8 }]}
                  placeholder="Address (optional)"
                  value={loc.address || ''}
                  onChangeText={(text) => {
                    const next = [...(data.additional_locations || [])];
                    next[index] = { ...next[index], address: text };
                    setData({ ...data, additional_locations: next });
                  }}
                />
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 8 }]}
                  placeholder="Latitude"
                  keyboardType="numeric"
                  value={loc.latitude}
                  onChangeText={(text) => {
                    const next = [...(data.additional_locations || [])];
                    next[index] = { ...next[index], latitude: text };
                    setData({ ...data, additional_locations: next });
                  }}
                />
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 8 }]}
                  placeholder="Longitude"
                  keyboardType="numeric"
                  value={loc.longitude}
                  onChangeText={(text) => {
                    const next = [...(data.additional_locations || [])];
                    next[index] = { ...next[index], longitude: text };
                    setData({ ...data, additional_locations: next });
                  }}
                />
                <Pressable
                  style={styles.removeButton}
                  onPress={() => {
                    const next = [...(data.additional_locations || [])];
                    next.splice(index, 1);
                    setData({ ...data, additional_locations: next });
                  }}
                >
                  <ThemedText style={{ color: '#fff' }}>Remove</ThemedText>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {Platform.OS === 'web' && (
          <View style={[styles.mapContainer, styles.mapColumn]}>
            <ThemedText type="subtitle" darkColor="#000">Select Exact Location</ThemedText>
            <View style={styles.mapFrameWrapper}>
              {typeof window !== 'undefined' && (
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                (() => {
                  const LeafletMapPicker = require('@/components/map/LeafletMapPicker.web').default;
                  return (
                    <LeafletMapPicker
                      latitude={hasValidLat ? latitude : undefined}
                      longitude={hasValidLng ? longitude : undefined}
                      onChange={(lat: number, lng: number) =>
                        setData({ ...data, latitude: String(lat), longitude: String(lng) })
                      }
                      height={480}
                    />
                  );
                })()
              )}
            </View>
          </View>
        )}
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
  sectionHeader: {
    backgroundColor: '#0A1B47',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    flex: 1,
  },
  formColumn: {
    flex: 1,
  },
  mapColumn: {
    flex: 1,
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
  mapContainer: {
    marginTop: 10,
  },
  mapFrameWrapper: {
    marginTop: 10,
    width: '100%',
    height: 350,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#0A1B47',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  removeButton: {
    backgroundColor: '#B00020',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  additionalContainer: {
    marginTop: 10,
    gap: 10,
  },
  additionalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default StepEventLocation; 