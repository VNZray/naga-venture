import TabSwitcher from '@/components/TabSwitcherComponent';
import { supabase } from '@/utils/supabase';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const TABS = [
  { key: 'business', label: 'Business Details' },
  { key: 'rooms', label: 'Room Listing' },
  { key: 'reviews', label: 'Ratings & Review' },
];

const BusinessProfile = () => {
  const [activeTab, setActiveTab] = useState('business');
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams();
  const [roomForm, setRoomForm] = useState({
    room_number: '',
    capacity: '',
    room_price: '',
    amenities: '',
    description: '',
    room_image: '',
    room_type: '',
  });
  const [showRoomModal, setShowRoomModal] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('Business')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching business:', error);
      } else {
        setBusiness(data);
      }

      setLoading(false);
    };

    fetchBusiness();
  }, [id]);

  const addRoom = async () => {
    if (!business?.id) return;

    const amenitiesArray = roomForm.amenities
      .split(',')
      .map((item) => item.trim());

    const { data, error } = await supabase.from('Room').insert([
      {
        ...roomForm,
        amenities: amenitiesArray,
        business_id: business.id,
        status: 'available',
      },
    ]);

    if (error) {
      console.error('Error adding room:', error);
    } else {
      console.log('Room added successfully:', data);
      setRoomForm({
        room_number: '',
        capacity: '',
        room_price: '',
        amenities: '',
        description: '',
        room_image: '',
        room_type: '',
      });
    }
    await fetchRooms();
  };

  const [rooms, setRooms] = useState<any[]>([]);

  const fetchRooms = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('Room')
      .select('*')
      .eq('business_id', id);

    if (error) {
      console.error('Error fetching rooms:', error);
    } else {
      setRooms(data);
    }
  };

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('Business')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching business:', error);
      } else {
        setBusiness(data);
      }

      setLoading(false);
      fetchRooms(); // fetch rooms after business is loaded
    };

    fetchBusiness();
  }, [id]);

  const renderTabContent = () => {
    if (loading) {
      return <Text style={{ marginTop: 20 }}>Loading...</Text>;
    }

    switch (activeTab) {
      case 'business':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Details</Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Name:</Text> {business?.business_name}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Type:</Text> {business?.business_type}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Category:</Text> {business?.category}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Phone:</Text> {business?.phone_number}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Email:</Text>{' '}
              {business?.business_email}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Address:</Text> {business?.barangay},{' '}
              {business?.city}, {business?.province}, {business?.postal_code}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Price Range:</Text>{' '}
              {business?.price_range}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Status:</Text> {business?.status}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Coordinates:</Text>{' '}
              {business?.latitude}, {business?.longitude}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Facebook:</Text>{' '}
              {business?.facebook_url}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Instagram:</Text>{' '}
              {business?.instagram_url}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Twitter:</Text> {business?.twitter_url}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Description:</Text>{' '}
              {business?.description || 'No description available.'}
            </Text>
          </View>
        );
      case 'rooms':
        return (
          <View style={styles.section}>
            <View style={styles.roomGrid}>
              {rooms.map((room, index) => (
                <View key={index} style={styles.roomCard}>
                  <Image
                    source={{
                      uri: room.room_image || 'https://via.placeholder.com/300',
                    }}
                    style={styles.roomImage}
                  />
                  <Text style={styles.roomText}>Room {room.room_number}</Text>
                  <Text style={styles.roomText}>👥 {room.capacity}</Text>
                  <Text style={styles.roomText}>🕒 {room.status}</Text>
                  <Text style={styles.roomText}>₱ {room.room_price}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      case 'reviews':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ratings & Review</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <Image
        source={{
          uri:
            business?.image_url ||
            'https://via.placeholder.com/300x180.png?text=No+Image',
        }}
        style={styles.banner}
      />

      <View style={styles.profileContainer}>
        <Image
          source={{
            uri:
              business?.image_url ||
              'https://via.placeholder.com/300x180.png?text=No+Image',
          }}
          style={styles.avatar}
        />

        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>
            {business?.business_name || 'Business Name'}
          </Text>
          <Text style={styles.location}>
            {business?.barangay}, {business?.city}, {business?.province}
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>✏️ Edit Profile</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => setShowRoomModal(true)}
          >
            <Text style={styles.buttonText}>➕ Add Room</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <TabSwitcher
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          active="#0A1B47"
          color="#0A1B47"
          tabPadding={10}
          tabSpacing={10}
          borderRadius={8}
          style={{ width: 600 }}
        />

        {renderTabContent()}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showRoomModal}
        onRequestClose={() => setShowRoomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Add New Room</Text>

            <TextInput
              placeholder="Room Number"
              value={roomForm.room_number}
              onChangeText={(text) =>
                setRoomForm({ ...roomForm, room_number: text })
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Room Type"
              value={roomForm.room_type}
              onChangeText={(text) =>
                setRoomForm({ ...roomForm, room_type: text })
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Capacity"
              value={roomForm.capacity}
              onChangeText={(text) =>
                setRoomForm({ ...roomForm, capacity: text })
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Room Price"
              value={roomForm.room_price}
              onChangeText={(text) =>
                setRoomForm({ ...roomForm, room_price: text })
              }
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Amenities (comma separated)"
              value={roomForm.amenities}
              onChangeText={(text) =>
                setRoomForm({ ...roomForm, amenities: text })
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={roomForm.description}
              onChangeText={(text) =>
                setRoomForm({ ...roomForm, description: text })
              }
              multiline
              style={styles.input}
            />
            <TextInput
              placeholder="Room Image URL"
              value={roomForm.room_image}
              onChangeText={(text) =>
                setRoomForm({ ...roomForm, room_image: text })
              }
              style={styles.input}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Pressable
                style={[styles.button, { flex: 1, backgroundColor: '#ccc' }]}
                onPress={() => setShowRoomModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, { flex: 1 }]}
                onPress={async () => {
                  await addRoom();
                  setShowRoomModal(false);
                }}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  banner: {
    width: '100%',
    height: 300,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  profileContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginTop: -95,
    borderWidth: 3,
    borderColor: '#fff',
    alignSelf: 'flex-start',
  },
  businessInfo: {
    marginTop: 8,
  },
  businessName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A1B47',
  },
  location: {
    color: '#555',
    marginTop: 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  button: {
    backgroundColor: '#0A1B47',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 16,
    borderRadius: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A1B47',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#0A1B47',
  },
  detail: {
    marginBottom: 6,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '20%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  roomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  roomCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'flex-start',
  },
  roomImage: {
    width: 160,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  roomText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
});

export default BusinessProfile;
