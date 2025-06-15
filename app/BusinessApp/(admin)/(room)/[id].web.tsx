import TabSwitcher from '@/components/TabSwitcherComponent';
import RoomDetails from '@/components/web-components/room-tabs/RoomDetails';
import RoomPhotos from '@/components/web-components/room-tabs/RoomPhotos';
import RoomReviews from '@/components/web-components/room-tabs/RoomReviews';
import { Business, Room } from '@/types/Business';
import { supabase } from '@/utils/supabase';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RoomFormModal from '../../../../components/web-components/modals/RoomFormModal';

const TABS = [
  { key: 'Room', label: 'Room Details' },
  { key: 'Photos', label: 'Room Photos' },
  { key: 'reviews', label: 'Ratings & Review' },
];

const RoomProfile = () => {
  const [activeTab, setActiveTab] = useState('Room');
  const [room, setRoom] = useState<Room | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams();
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomForm, setRoomForm] = useState<
    Omit<Room, 'id' | 'business_id' | 'status'>
  >({
    room_number: '',
    room_type: '',
    capacity: '',
    room_price: '',
    amenities: '',
    description: '',
    room_image: '',
    room_photos: '',
  });

  const fetchBusiness = async (businessId: string) => {
    const { data, error } = await supabase
      .from('Business')
      .select('*')
      .eq('id', businessId)
      .single();

    if (error) {
      console.error('Error fetching business:', error);
    } else {
      setBusiness(data);
    }
  };

  const fetchRoom = async () => {
    if (!id) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('Room')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching room:', error);
    } else {
      setRoom(data);
      if (data.business_id) {
        fetchBusiness(data.business_id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const renderTabContent = () => {
    if (loading) {
      return <Text style={{ marginTop: 20 }}>Loading...</Text>;
    }

    switch (activeTab) {
      case 'Room':
        return <RoomDetails room={room} />;
      case 'Photos':
        return <RoomPhotos business={business} room={room} />;
      case 'reviews':
        return <RoomReviews />;
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
            room?.room_image ||
            'https://via.placeholder.com/300x180.png?text=No+Image',
        }}
        style={styles.banner}
      />

      {/* Room Info Header */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri:
              room?.room_image ||
              'https://via.placeholder.com/300x180.png?text=No+Image',
          }}
          style={styles.avatar}
        />

        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>
            Room Number {room?.room_number || 'N/A'}
          </Text>
          <Text style={styles.location}>
            {room?.room_type || 'Type Unknown'}
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <Pressable
            style={styles.button}
            onPress={() => setShowRoomModal(true)}
          >
            <Text style={styles.buttonText}>✏️ Edit Room</Text>
          </Pressable>
        </View>
      </View>

      {/* Tabs + Content */}
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
          style={{ width: 600, marginBottom: 16 }}
        />

        {renderTabContent()}
      </View>

      {/* Edit Room Modal */}
      <RoomFormModal
        visible={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        form={roomForm}
        setForm={setRoomForm}
        businessId={room?.business_id}
        onSuccess={fetchRoom}
      />
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
});

export default RoomProfile;
