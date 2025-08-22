import { ThemedText } from '@/components/ThemedText';
import { EventFormData } from '@/types/event';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface EventEditFormProps {}

const EventEditForm: React.FC<EventEditFormProps> = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState<EventFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) {
        setError('Event ID is missing.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      const dummyEvents = [
        {
          id: 'e1a2b3c4-d5e6-7890-1234-567890abcdef',
          name: 'Basilica Minore de Nuestra Señora de Peñafrancia',
          address: 'Balatas Road',
          category: 'religious',
          description: 'The home of the revered image of Our Lady of Peñafrancia, the patroness of Bicol. This basilica is a major pilgrimage site, especially during the Peñafrancia Festival.',
          contact_phone: '+63544731818',
          contact_email: 'artsfest@example.com',
          website: 'https://penafrancia.net/',
          opening_time: '05:00:00',
          closing_time: '20:00:00',
          picture: 'https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg',
          event_type: 'religious',
          city: 'Naga City',
          province: 'Camarines Sur',
          latitude: '13.6213',
          longitude: '123.1870',
          start_time: '2024-06-01T09:00:00Z',
          end_time: '2024-06-07T17:00:00Z',
          entry_fee: '0',
        },
        {
            id: 'f1g2h3i4-j5k6-7890-1234-567890ghijkl',
            name: 'Bicol Food Fair',
            address: 'SM City Naga, Naga City',
            category: 'food',
            description: 'Experience the authentic flavors of Bicol in this annual food fair.',
            contact_phone: '09987654321',
            contact_email: 'foodfair@example.com',
            website: 'www.bicolfoodfair.com',
            opening_time: '10:00 AM',
            closing_time: '09:00 PM',
            picture: 'https://picsum.photos/id/238/200/300',
            event_type: 'food',
            city: 'Naga City',
            province: 'Camarines Sur',
            latitude: '13.6200',
            longitude: '123.1890',
            start_time: '2024-07-10T10:00:00Z',
            end_time: '2024-07-15T21:00:00Z',
            entry_fee: '50',
          },
      ];

      const foundEvent = dummyEvents.find((e) => e.id === id);

      if (!foundEvent) {
        setError('Event not found.');
      } else {
        setFormData(foundEvent as EventFormData);
      }
      setLoading(false);
    };

    fetchEventDetails();
  }, [id]);

  const handleChange = (name: keyof EventFormData, value: string) => {
    if (formData) {
      setFormData((prev) => ({ ...prev!, [name]: value }));
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (formData) {
        setFormData({ ...formData, picture: result.assets[0].uri });
      }
    }
  };

  const handleSave = () => {
    console.log('Saving changes:', formData);
    router.back();
  };

  const handleDelete = () => {
    // In a real application, you would implement the actual deletion logic here
    console.log('Deleting event with ID:', id);
    // After deletion, navigate back to a list of events or a confirmation page
    router.push('/TourismApp/(admin)/events'); // Navigate back to events list
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText>Loading event details...</ThemedText>
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

  if (!formData) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Event not found.</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Edit Spot Details</ThemedText>
        <View style={{ width: 1 }} />{/* For alignment */}
      </View>
      <ScrollView style={styles.formContainer}>
        {/* Name and Description Section */}
        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Name</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
          />

          <ThemedText style={styles.sectionTitle}>Description</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => handleChange('description', text)}
            multiline
          />
        </View>

        {/* Spot Type and Address Section */}
        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Spot Type</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.event_type}
            onChangeText={(text) => handleChange('event_type', text)}
          />

          <ThemedText style={styles.sectionTitle}>Address</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(text) => handleChange('address', text)}
          />
        </View>

        {/* Contact Phone and Website Section */}
        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Contact Phone</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.contact_phone}
            onChangeText={(text) => handleChange('contact_phone', text)}
            keyboardType="phone-pad"
          />

          <ThemedText style={styles.sectionTitle}>Website</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.website}
            onChangeText={(text) => handleChange('website', text)}
            keyboardType="url"
          />
        </View>

        {/* Business Hours Section */}
        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Business Hours</ThemedText>
          <View style={styles.timeContainer}>
            <TextInput
              style={[styles.input, styles.timeInput]}
              value={formData.opening_time}
              onChangeText={(text) => handleChange('opening_time', text)}
            />
            <ThemedText style={styles.timeSeparator}>to</ThemedText>
            <TextInput
              style={[styles.input, styles.timeInput]}
              value={formData.closing_time}
              onChangeText={(text) => handleChange('closing_time', text)}
            />
          </View>
        </View>

        {/* Picture URL Section - Reverted to Image Picker */}
        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>Picture URL</ThemedText>
          <Image
            source={{
              uri:
                formData.picture ||
                'https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg',
            }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <View style={styles.imageActionButtons}>
            <TouchableOpacity onPress={pickImage} style={[styles.imageButton, styles.changeImageButton]}>
              <Ionicons name="image-outline" size={20} color="#fff" />
              <ThemedText style={styles.imageButtonText}>Change Image</ThemedText>
            </TouchableOpacity>
            {formData.picture && (
              <TouchableOpacity 
                onPress={() => setFormData({ ...formData, picture: '' })} 
                style={[styles.imageButton, styles.removeImageButton]}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <ThemedText style={styles.imageButtonText}>Remove Image</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity onPress={handleDelete} style={[styles.bottomButton, styles.deleteButton, styles.deleteButtonLeft]}>
            <ThemedText style={styles.bottomButtonText}>Delete</ThemedText>
          </TouchableOpacity>
          <View style={styles.rightButtonsContainer}>
            <TouchableOpacity onPress={handleCancel} style={[styles.bottomButton, styles.cancelButton]}>
              <ThemedText style={styles.bottomButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.bottomButton, styles.saveButton]}>
              <ThemedText style={styles.bottomButtonText}>Save Changes</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
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
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  timeSeparator: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  imageActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    marginTop: 10,
  },
  imageButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  imageButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  removeImageButton: {
    backgroundColor: '#dc3545',
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#e0e0e0',
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  rightButtonsContainer: {
    flexDirection: 'row',
  },
  bottomButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  deleteButtonLeft: {
    marginLeft: 0,
    marginRight: 10,
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeImageButton: {
    backgroundColor: '#007bff',
  },
});

export default EventEditForm; 