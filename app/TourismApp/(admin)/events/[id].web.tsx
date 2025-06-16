import { ThemedText } from '@/components/ThemedText';
import { EventFormData } from '@/types/event'; // Reusing EventFormData, might need to extend it later
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const EventDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventFormData | null>(null);
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

      // Simulate fetching from local storage. In a real app, you'd get this from a global state/context or actual local storage.
      // For now, let's assume a dummy data structure similar to what we have in event.web.tsx
      const dummyEvents = [
        {
          id: 'e1a2b3c4-d5e6-7890-1234-567890abcdef',
          name: 'Naga City Arts Festival',
          address: 'Plaza Quince Martires, Naga City',
          category: 'cultural',
          description: 'A vibrant festival showcasing the rich culture and arts of Naga City.',
          contact_phone: '09123456789',
          contact_email: 'artsfest@example.com',
          website: 'www.nagacityarts.com',
          opening_time: '09:00 AM',
          closing_time: '05:00 PM',
          picture: 'https://picsum.photos/id/237/200/300',
          event_type: 'cultural',
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
        setEvent(foundEvent as EventFormData);
      }
      setLoading(false);
    };

    fetchEventDetails();
  }, [id]);

  const handleDelete = () => {
    // In a real application, you would implement the actual deletion logic here
    console.log('Deleting event with ID:', id);
    // After deletion, navigate back to a list of events or a confirmation page
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

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Event not found.</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Event Details</ThemedText>
        <View style={{ width: 1 }} />{/* For alignment */}
      </View>
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Ionicons name="star" size={24} color="#FFD700" />
          <ThemedText style={[styles.metricValue, { color: 'black' }]}>
            4.8
          </ThemedText>
          <ThemedText style={[styles.metricLabel, { color: 'black' }]}>
            Average Rating
          </ThemedText>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="eye" size={24} color="#4CAF50" />
          <ThemedText style={[styles.metricValue, { color: 'black' }]}>
            356
          </ThemedText>
          <ThemedText style={[styles.metricLabel, { color: 'black' }]}>
            Profile Views
          </ThemedText>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="share" size={24} color="#2196F3" />
          <ThemedText style={[styles.metricValue, { color: 'black' }]}>
            1823
          </ThemedText>
          <ThemedText style={[styles.metricLabel, { color: 'black' }]}>
            Socials Click
          </ThemedText>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="chatbox-ellipses" size={24} color="#9C27B0" />
          <ThemedText style={[styles.metricValue, { color: 'black' }]}>
            26
          </ThemedText>
          <ThemedText style={[styles.metricLabel, { color: 'black' }]}>
            Total Reviews
          </ThemedText>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Left Column */}
        <View style={styles.leftColumn}>
          {/* Main Event Information */}
          <View style={styles.mainInfoCard}>
            {/* Image Gallery */}
            <View style={styles.imageGalleryPlaceholder}>
              <Image
                source={{
                  uri:
                    event.picture ||
                    'https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg',
                }}
                style={styles.eventImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.eventHeader}>
              <View style={styles.ratingContainer}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < Math.floor(4.8) ? 'star' : 'star-outline'}
                    size={20}
                    color="#FFD700"
                  />
                ))}
                <ThemedText style={[styles.reviewsText, { color: 'black' }]}>
                  317 Reviews
                </ThemedText>
              </View>
              <View style={styles.nameAndEdit}>
                <ThemedText style={[styles.eventName, { color: 'black' }]}>
                  {event.name}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* About The Event */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: 'black' }]}>
                About The Event
              </ThemedText>
            </View>
            <ThemedText style={[styles.sectionContent, { color: 'black' }]}>
              {event.description}
            </ThemedText>
          </View>

          {/* Categories */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: 'black' }]}>
                Categories
              </ThemedText>
            </View>
            <ThemedText style={[styles.sectionContent, { color: 'black' }]}>
              {event.event_type ||
                'Categories help users filter and find your event in the Naga Ventures App. Select the categories that apply to this Event'}
            </ThemedText>
            {event.event_type && (
              <Text style={[styles.categoryTag, { color: 'black' }]}>
                {event.event_type}
              </Text>
            )}
          </View>

          {/* Event Hours */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: 'black' }]}>
                Event Hours
              </ThemedText>
            </View>
            {event.start_time && event.end_time ? (
              <View style={styles.businessHourRow}>
                <ThemedText
                  style={[styles.businessHourTime, { color: 'black' }]}>
                  {`${event.start_time} - ${event.end_time}`}
                </ThemedText>
              </View>
            ) : (
              <ThemedText style={[styles.sectionContent, { color: 'black' }]}>
                Set your event hours to let people know when this Event is open.
              </ThemedText>
            )}
          </View>
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          {/* Event Information Card */}
          <View style={styles.eventInfoCard}>
            <ThemedText style={[styles.sectionTitle, { color: 'black' }]}>
              Event Information
            </ThemedText>
            {/* Map Placeholder */}
            <View style={styles.mapPlaceholder}>
              <ThemedText style={[styles.galleryText, { color: 'black' }]}>
                Map Placeholder
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: 'black' }]}>
                Address
              </ThemedText>
              <ThemedText style={[styles.infoValue, { color: 'black' }]}>
                {event.address}
              </ThemedText>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: 'black' }]}>
                Contact Number
              </ThemedText>
              <ThemedText style={[styles.infoValue, { color: 'black' }]}>
                {event.contact_phone || '-'}
              </ThemedText>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: 'black' }]}>
                Website
              </ThemedText>
              <ThemedText style={[styles.infoValue, { color: 'black' }]}>
                {event.website || 'Add your event website (optional).'}
              </ThemedText>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: 'black' }]}>
                Social Apps
              </ThemedText>
              <ThemedText style={[styles.infoValue, { color: 'black' }]}>
                {'Connect your social media (optional).'}
              </ThemedText>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity onPress={() => router.push(`/TourismApp/(admin)/events/edit/${id}`)} style={styles.editButton}>
          <ThemedText style={styles.editButtonText}>Edit Details</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  mainInfoCard: {
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
  imageGalleryPlaceholder: {
    height: 400,
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  galleryText: {
    color: '#666',
  },
  eventHeader: {
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewsText: {
    marginLeft: 10,
    color: '#666',
  },
  nameAndEdit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  eventInfoCard: {
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    marginLeft: 10,
    textAlign: 'right',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionContent: {
    fontSize: 14,
    color: '#333',
  },
  categoryTag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  mapPlaceholder: {
    backgroundColor: '#eee',
    height: 150,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  contentContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  leftColumn: {
    flex: 0.7,
  },
  rightColumn: {
    flex: 0.3,
  },
  businessHourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  businessHourTime: {
    fontSize: 14,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 25,
    width: '100%',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  editButton: {
    
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
});

export default EventDetails; 