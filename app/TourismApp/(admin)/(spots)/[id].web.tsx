import { ThemedText } from '@/components/ThemedText';
import { TouristSpot } from '@/types/TouristSpot';
import { subscribeToSpotUpdates } from '@/utils/events';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const SpotDetails = () => {
  const { id } = useLocalSearchParams();
  const [spot, setSpot] = useState<TouristSpot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      }
      setLoading(false);
    };

    fetchSpotDetails();
    // Subscribe to spot updates
    const unsubscribe = subscribeToSpotUpdates(() => {
      fetchSpotDetails();
    });
    return () => unsubscribe();
  }, [id]);

  const handleEdit = async () => {
    if (!spot) return;

    try {
      const { error } = await supabase
        .from('tourist_spots')
        .update({ status: 'pending' })
        .eq('id', spot.id);

      if (error) {
        console.error('Error updating spot status:', error);
        return;
      }

      // Navigate to edit page
      router.push(`/TourismApp/(admin)/(spots)/edit/${spot.id}`);
    } catch (err) {
      console.error('Error handling edit:', err);
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
          {/* Main Spot Information */}
          <View style={styles.mainInfoCard}>
            {/* Image Gallery */}
            <View style={styles.imageGalleryPlaceholder}>
              <Image
                source={{
                  uri:
                    spot.picture ||
                    'https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg',
                }}
                style={styles.spotImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.spotHeader}>
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
                <ThemedText style={[styles.spotName, { color: 'black' }]}>
                  {spot.name}
                </ThemedText>
                <TouchableOpacity onPress={handleEdit}>
                  <Ionicons name="create-outline" size={24} color="#007bff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* About The Attraction */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: 'black' }]}>
                About The Attraction
              </ThemedText>
            </View>
            <ThemedText style={[styles.sectionContent, { color: 'black' }]}>
              {spot.description || 'Attract Tourist with a short description.'}
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
              {spot.spot_type ||
                'Categories help users filter and find your shop in the Naga Ventures App. Select the categories that apply this Attraction'}
            </ThemedText>
            {spot.spot_type && (
              <Text style={[styles.categoryTag, { color: 'black' }]}>
                {spot.spot_type}
              </Text>
            )}
          </View>

          {/* Business Hours */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: 'black' }]}>
                Business Hours
              </ThemedText>
            </View>
            {spot.opening_time && spot.closing_time ? (
              <View style={styles.businessHourRow}>
                <ThemedText
                  style={[styles.businessHourTime, { color: 'black' }]}
                >
                  {`${spot.opening_time} - ${spot.closing_time}`}
                </ThemedText>
              </View>
            ) : (
              <ThemedText style={[styles.sectionContent, { color: 'black' }]}>
                Set your business hours to let people know when this Attraction
                is open.
              </ThemedText>
            )}
          </View>
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          {/* Tourist Spot Information Card */}
          <View style={styles.shopInfoCard}>
            <ThemedText style={[styles.sectionTitle, { color: 'black' }]}>
              Tourist Spot Information
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
                {spot.address}
              </ThemedText>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: 'black' }]}>
                Contact Number
              </ThemedText>
              <ThemedText style={[styles.infoValue, { color: 'black' }]}>
                {spot.contact_phone || '-'}
              </ThemedText>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: 'black' }]}>
                Website
              </ThemedText>
              <ThemedText style={[styles.infoValue, { color: 'black' }]}>
                {spot.website || 'Add your shop website (optional).'}
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
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: 'black' }]}>
                Status
              </ThemedText>
              <ThemedText style={[styles.infoValue, { color: 'black' }]}>
                {spot.status || 'Not set'}
              </ThemedText>
            </View>
          </View>
        </View>
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
  spotImage: {
    width: '100%',
    height: '100%',
  },
  galleryText: {
    color: '#666',
  },
  spotHeader: {
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
  spotName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  shopInfoCard: {
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
    color: '#007bff',
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
});

export default SpotDetails;
