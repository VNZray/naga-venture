import PressableButton from '@/components/PressableButton';
import { ThemedText } from '@/components/ThemedText';
import { TouristSpot } from '@/types/TouristSpot';
import { supabase } from '@/utils/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

const EditSpot = () => {
  const { id } = useLocalSearchParams();
  const [spot, setSpot] = useState<TouristSpot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    spot_type: '',
    address: '',
    contact_phone: '',
    website: '',
    opening_time: '',
    closing_time: '',
    picture: '',
  });

  useEffect(() => {
    const fetchSpotDetails = async () => {
      if (!id) {
        setError('Spot ID is missing.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('tourist_spots')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
        console.error('Error fetching spot details:', error.message);
      } else {
        setSpot(data as TouristSpot);
        setFormData({
          name: data.name || '',
          description: data.description || '',
          spot_type: data.spot_type || '',
          address: data.address || '',
          contact_phone: data.contact_phone || '',
          website: data.website || '',
          opening_time: data.opening_time || '',
          closing_time: data.closing_time || '',
          picture: data.picture || '',
        });
      }
      setLoading(false);
    };

    fetchSpotDetails();
  }, [id]);

  const handleSubmit = async () => {
    if (!spot) return;

    try {
      const { error } = await supabase
        .from('tourist_spots')
        .update({
          ...formData,
          status: 'pending',
        })
        .eq('id', spot.id);

      if (error) {
        console.error('Error updating spot:', error);
        return;
      }

      // Navigate back to the details page
      router.back();
    } catch (err) {
      console.error('Error handling submit:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText>Loading spot details...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
      </View>
    );
  }

  if (!spot) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Spot not found.</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Edit Spot Details</ThemedText>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Name</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter spot name"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Description</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              placeholder="Enter spot description"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Spot Type</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.spot_type}
              onChangeText={(text) =>
                setFormData({ ...formData, spot_type: text })
              }
              placeholder="Enter spot type"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Address</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) =>
                setFormData({ ...formData, address: text })
              }
              placeholder="Enter address"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Contact Phone</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.contact_phone}
              onChangeText={(text) =>
                setFormData({ ...formData, contact_phone: text })
              }
              placeholder="Enter contact phone"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Website</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.website}
              onChangeText={(text) =>
                setFormData({ ...formData, website: text })
              }
              placeholder="Enter website URL"
              keyboardType="url"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Business Hours</ThemedText>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={[styles.input, styles.timeInput]}
                value={formData.opening_time}
                onChangeText={(text) =>
                  setFormData({ ...formData, opening_time: text })
                }
                placeholder="Opening time"
              />
              <Text style={styles.timeSeparator}>to</Text>
              <TextInput
                style={[styles.input, styles.timeInput]}
                value={formData.closing_time}
                onChangeText={(text) =>
                  setFormData({ ...formData, closing_time: text })
                }
                placeholder="Closing time"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Picture URL</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.picture}
              onChangeText={(text) =>
                setFormData({ ...formData, picture: text })
              }
              placeholder="Enter picture URL"
            />
          </View>

          <View style={styles.buttonContainer}>
            <PressableButton
              type="cancel"
              color="#fff"
              Title="Cancel"
              onPress={() => router.back()}
              width={200}
            />
            <PressableButton
              type="primary"
              color="#fff"
              Title="Save Changes"
              onPress={handleSubmit}
              width={200}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    flex: 1,
  },
  timeSeparator: {
    marginHorizontal: 10,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default EditSpot;
