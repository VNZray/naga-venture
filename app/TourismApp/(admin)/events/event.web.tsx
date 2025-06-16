import AddEventForm from '@/components/AddEventForm';
import { ThemedText } from '@/components/ThemedText';
import { EventFormData } from '@/types/event';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

const EventsCMS = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 'e1a2b3c4-d5e6-7890-1234-567890abcdef',
      name: 'Naga City Arts Festival',
      address: 'Plaza Quince Martires, Naga City',
      category: 'cultural',
    },
    {
      id: 'f1g2h3i4-j5k6-7890-1234-567890ghijkl',
      name: 'Bicol Food Fair',
      address: 'SM City Naga, Naga City',
      category: 'food',
    },
    {
      id: 'm1n2o3p4-q5r6-7890-1234-567890mnopqr',
      name: 'Mount Isarog Eco-Challenge',
      address: 'Mount Isarog National Park, Naga City',
      category: 'adventure',
    },
    {
      id: 's1t2u3v4-w5x6-7890-1234-567890stuvwx',
      name: 'Peñafrancia Fluvial Procession',
      address: 'Naga River, Naga City',
      category: 'religious',
    },
  ]);
  const router = useRouter();

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || event.category === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Cultural', 'Food', 'Adventure', 'Religious'];

  const handleAddEvent = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleEventAdded = (newEvent: EventFormData) => {
    const newId = Math.random().toString(36).substring(2, 15);

    const eventToAdd = {
      id: newId,
      name: newEvent.name,
      address: newEvent.address,
      category: newEvent.event_type,
    };
    setEvents((prevEvents) => [...prevEvents, eventToAdd]);
    console.log('Event added successfully!', newEvent);
    handleCloseModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerControls}>
        <View style={styles.categoryFilters}>
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.categoryButton,
                activeCategory === category && styles.activeCategoryButton,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <ThemedText
                style={[
                  styles.categoryButtonText,
                  activeCategory === category && styles.activeCategoryButtonText,
                ]}
              >
                {category}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Pressable style={styles.searchButton}>
            <FontAwesome name="search" size={16} color="#fff" />
          </Pressable>
          <Pressable style={styles.addButton} onPress={handleAddEvent}>
            <FontAwesome name="plus" size={16} color="#fff" />
            <ThemedText style={styles.addButtonText}>Add</ThemedText>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.tableScrollView}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <ThemedText style={styles.columnHeader}>ID</ThemedText>
            <ThemedText style={styles.columnHeader}>Name</ThemedText>
            <ThemedText style={styles.columnHeader}>Address</ThemedText>
            <ThemedText style={styles.columnHeader}>Category</ThemedText>
            <ThemedText style={styles.columnHeader}>Actions</ThemedText>
          </View>
          {filteredEvents.map((event) => (
            <View key={event.id} style={styles.tableRow}>
              <ThemedText style={styles.columnData}>{event.id}</ThemedText>
              <ThemedText style={styles.columnData}>{event.name}</ThemedText>
              <ThemedText style={styles.columnData}>{event.address}</ThemedText>
              <ThemedText style={styles.columnData}>{event.category}</ThemedText>
              <Pressable
                style={styles.viewDetailsButton}
                onPress={() => router.push({ pathname: '/TourismApp/events/[id]', params: { id: event.id } })}
              >
                <ThemedText style={styles.viewDetailsButtonText}>
                  View Full Details
                </ThemedText>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.paginationContainer}>
        <Pressable style={styles.paginationButton}>
          <ThemedText>{"< Previous"}</ThemedText>
        </Pressable>
        <ThemedText style={styles.pageNumber}>1</ThemedText>
        <Pressable style={styles.paginationButton}>
          <ThemedText>{"Next >"}</ThemedText>
        </Pressable>
      </View>
      <AddEventForm
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onEventAdded={handleEventAdded}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  categoryFilters: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  activeCategoryButton: {
    backgroundColor: '#0A1B47',
  },
  categoryButtonText: {
    color: '#000',
    fontSize: 14,
  },
  activeCategoryButtonText: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    width: 200,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#0A1B47',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A1B47',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  tableScrollView: {
    flex: 1,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0A1B47',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  columnHeader: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  columnData: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  viewDetailsButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  viewDetailsButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#0A1B47',
    marginHorizontal: 5,
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: '#000',
  },
});

export default EventsCMS;
