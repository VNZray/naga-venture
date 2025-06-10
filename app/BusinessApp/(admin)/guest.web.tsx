import TabSwitcher from '@/components/TabSwitcherComponent';
import { ThemedText } from '@/components/ThemedText';
import { bookings } from '@/Controller/AccommodationData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const statusColors: Record<string, string> = {
  Reserved: '#d0e7ff',
  Cancelled: '#ffd6d6',
  'Checked-in': '#d6f5d6',
  'Checked-out': '#ffe8c7',
  Pending: '#e1e1e1',
};

const Guest = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [filteredBookings, setFilteredBookings] = useState(bookings);

  const colorScheme = useColorScheme();
  const activeBackground = '#0A1B47';

  const filterByStatus = (data: typeof bookings) => {
    return data.filter((booking) => {
      switch (activeTab) {
        case 'bookings':
          return ['Reserved', 'Pending', 'Checked-in'].includes(booking.status);
        case 'reserved':
          return booking.status === 'Reserved';
        case 'check-in':
          return booking.status === 'Checked-in';
        case 'check-out':
          return booking.status === 'Checked-out';
        case 'cancelled':
          return booking.status === 'Cancelled';
        case 'all':
        default:
          return true;
      }
    });
  };

  // Handle searching in filtered data
  const handleSearch = (text: string) => {
    setSearch(text);

    const filteredByStatus = filterByStatus(bookings);

    if (text.trim() === '') {
      setFilteredBookings(filteredByStatus);
    } else {
      const filteredBySearch = filteredByStatus.filter((booking) => {
        return (
          booking.id.toLowerCase().includes(text.toLowerCase()) ||
          booking.name.toLowerCase().includes(text.toLowerCase())
        );
      });
      setFilteredBookings(filteredBySearch);
    }
  };

  React.useEffect(() => {
    handleSearch(search);
  }, [activeTab]);

  const [fontsLoaded] = useFonts({
    'Poppins-Black': require('@/assets/fonts/Poppins/Poppins-Black.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={{ padding: 16 }}>
      <View style={styles.tableContainer}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TabSwitcher
            tabs={[
              { key: 'all', label: 'All' },
              { key: 'bookings', label: 'Bookings' },
              { key: 'reserved', label: 'Reserved' },
              { key: 'check-in', label: 'Check-in' },
              { key: 'check-out', label: 'Check-out' },
              { key: 'cancelled', label: 'Cancelled' },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            color={'#000'}
            active={activeBackground}
            textStyle={{ fontFamily: 'Poppins-SemiBold' }}
            style={{ width: 800 }}
          />
          <View style={styles.searchWrapper}>
            <Ionicons
              name="search"
              size={20}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by Booking ID or Guest Name"
              value={search}
              onChangeText={handleSearch}
              placeholderTextColor="#888"
            />
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Booking ID</Text>
          <Text style={styles.headerCell}>Room</Text>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Balance</Text>
          <Text style={styles.headerCell}>Paid</Text>
          <Text style={styles.headerCell}>Status</Text>
          <Text style={styles.headerCell}>Actions</Text>
        </View>

        {/* Table Rows */}
        <FlatList
          style={{ borderWidth: 1, borderColor: '#DEE3F2', borderRadius: 6 }}
          data={filteredBookings}
          keyExtractor={(item) => item.id + item.room}
          renderItem={({ item, index }) => (
            <View style={[styles.row, index % 2 !== 0 && styles.oddRow]}>
              <Text style={styles.cell}>{item.id}</Text>
              <Text style={styles.cell}>{item.room}</Text>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.balance}</Text>
              <Text style={styles.cell}>{item.paid}</Text>

              <View style={[styles.cell, { alignItems: 'center' }]}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusColors[item.status] || '#ccc' },
                  ]}
                >
                  <ThemedText
                    style={styles.statusText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.status}
                  </ThemedText>
                </View>
              </View>

              <Pressable style={styles.actionButton}>
                <Text style={styles.actionText}>View Full Details</Text>
              </Pressable>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Guest;

const styles = StyleSheet.create({
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
    padding: 16,
    backgroundColor: '#fff',
  },
  tabsContainer: {
    paddingVertical: 16,
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'nowrap',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0A1B47',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  oddRow: {
    backgroundColor: '#f8f8f8',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#0A1B47',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#0A1B47',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    flex: 1, // Take remaining space
    backgroundColor: '#fff',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
    fontFamily: 'Poppins-Regular',
    color: '#000',
    borderWidth: 0,
  },
});
