import SearchBar from '@/components/SearchBar';
import { ThemedText } from '@/components/ThemedText';
import CategoryFilter from '@/components/touristSpot/webComponents/CategoryFilter';
import Pagination from '@/components/touristSpot/webComponents/Pagination';
import TouristSpotTable from '@/components/touristSpot/webComponents/TouristSpotTable';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AddSpotForm from './(spots)/add-spot.web';

interface TouristSpot {
  id: string;
  name: string;
  description: string;
  spot_type: string;
  address: string;
  city: string;
  province: string;
  location: any;
  google_maps_place_id: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  website: string | null;
  opening_time: string | null;
  closing_time: string | null;
  entry_fee: number | null;
  status: string;
  is_featured: boolean;
  average_rating: number | null;
  review_count: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

const TouristSpots = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddSpotModalVisible, setAddSpotModalVisible] = useState(false);
  const spotsPerPage = 10;

  // Mock data - replace with actual data from your backend
  const mockSpots: TouristSpot[] = [
    {
      id: '1',
      name: 'Ateneo de Naga University',
      description: 'A prominent university in Naga City',
      spot_type: 'Historical',
      address: 'Ateneo Avenue, Bagumbayan Sur',
      city: 'Naga City',
      province: 'Camarines Sur',
      location: { lat: 13.6214, lng: 123.1947 },
      google_maps_place_id: null,
      contact_phone: null,
      contact_email: null,
      website: null,
      opening_time: '08:00',
      closing_time: '17:00',
      entry_fee: 0,
      status: 'Active',
      is_featured: true,
      average_rating: 4.5,
      review_count: 120,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: null,
      updated_by: null,
    },
    {
      id: '2',
      name: 'Camarines Sur National High School',
      description: 'A historic high school',
      spot_type: 'Historical',
      address: 'Peñafrancia Avenue',
      city: 'Naga City',
      province: 'Camarines Sur',
      location: { lat: 13.6214, lng: 123.1947 },
      google_maps_place_id: null,
      contact_phone: null,
      contact_email: null,
      website: null,
      opening_time: '07:00',
      closing_time: '17:00',
      entry_fee: 0,
      status: 'Active',
      is_featured: false,
      average_rating: 4.2,
      review_count: 80,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: null,
      updated_by: null,
    },
    {
      id: '3',
      name: 'Holy Rosary Minor Seminary',
      description: 'A seminary with historical significance',
      spot_type: 'Historical',
      address: 'Elias Angeles Street',
      city: 'Naga City',
      province: 'Camarines Sur',
      location: { lat: 13.6214, lng: 123.1947 },
      google_maps_place_id: null,
      contact_phone: null,
      contact_email: null,
      website: null,
      opening_time: '08:00',
      closing_time: '17:00',
      entry_fee: 0,
      status: 'Active',
      is_featured: false,
      average_rating: 4.6,
      review_count: 90,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: null,
      updated_by: null,
    },
    {
      id: '4',
      name: 'Naga College Foundation',
      description: 'A well-known college in Naga City',
      spot_type: 'Historical',
      address: 'Magsaysay Avenue',
      city: 'Naga City',
      province: 'Camarines Sur',
      location: { lat: 13.6214, lng: 123.1947 },
      google_maps_place_id: null,
      contact_phone: null,
      contact_email: null,
      website: null,
      opening_time: '07:00',
      closing_time: '18:00',
      entry_fee: 0,
      status: 'Active',
      is_featured: false,
      average_rating: 4.3,
      review_count: 110,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: null,
      updated_by: null,
    },
    {
      id: '5',
      name: 'Our Lady of Peñafrancia Parish Church',
      description: 'A significant religious site',
      spot_type: 'Historical',
      address: 'Peñafrancia Avenue',
      city: 'Naga City',
      province: 'Camarines Sur',
      location: { lat: 13.6214, lng: 123.1947 },
      google_maps_place_id: null,
      contact_phone: null,
      contact_email: null,
      website: null,
      opening_time: '06:00',
      closing_time: '19:00',
      entry_fee: 0,
      status: 'Active',
      is_featured: true,
      average_rating: 4.7,
      review_count: 150,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: null,
      updated_by: null,
    },
    {
      id: '6',
      name: 'San Francisco Church',
      description: 'A historical church in Naga City',
      spot_type: 'Historical',
      address: 'Peñafrancia Street',
      city: 'Naga City',
      province: 'Camarines Sur',
      location: { lat: 13.6214, lng: 123.1947 },
      google_maps_place_id: null,
      contact_phone: null,
      contact_email: null,
      website: null,
      opening_time: '07:00',
      closing_time: '18:00',
      entry_fee: 0,
      status: 'Active',
      is_featured: false,
      average_rating: 4.4,
      review_count: 100,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: null,
      updated_by: null,
    },
    {
      id: '7',
      name: 'The Basilica Minore',
      description: 'A famous basilica dedicated to Our Lady of Peñafrancia',
      spot_type: 'Historical',
      address: 'Balatas Road',
      city: 'Naga City',
      province: 'Camarines Sur',
      location: { lat: 13.6214, lng: 123.1947 },
      google_maps_place_id: null,
      contact_phone: null,
      contact_email: null,
      website: null,
      opening_time: '06:00',
      closing_time: '19:00',
      entry_fee: 0,
      status: 'Active',
      is_featured: true,
      average_rating: 4.8,
      review_count: 200,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: null,
      updated_by: null,
    },
    {
      id: '8',
      name: 'The Naga Metropolitan Cathedral',
      description: 'The main cathedral of Naga City',
      spot_type: 'Historical',
      address: 'Elias Angeles Street',
      city: 'Naga City',
      province: 'Camarines Sur',
      location: { lat: 13.6214, lng: 123.1947 },
      google_maps_place_id: null,
      contact_phone: null,
      contact_email: null,
      website: null,
      opening_time: '06:00',
      closing_time: '18:00',
      entry_fee: 0,
      status: 'Active',
      is_featured: false,
      average_rating: 4.5,
      review_count: 130,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: null,
      updated_by: null,
    },
    {
      id: '9',
      name: 'The Old Abella Mansion Arch',
      description: 'An old mansion with historical significance',
      spot_type: 'Historical',
      address: 'Panganiban Drive',
      city: 'Naga City',
      province: 'Camarines Sur',
      location: { lat: 13.6214, lng: 123.1947 },
      google_maps_place_id: null,
      contact_phone: null,
      contact_email: null,
      website: null,
      opening_time: '09:00',
      closing_time: '17:00',
      entry_fee: 0,
      status: 'Active',
      is_featured: false,
      average_rating: 4.1,
      review_count: 60,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: null,
      updated_by: null,
    },
    {
      id: '10',
      name: 'The Porta Mariae',
      description: 'A triumphal arch dedicated to the Virgin Mary',
      spot_type: 'Historical',
      address: 'Elias Angeles Street',
      city: 'Naga City',
      province: 'Camarines Sur',
      location: { lat: 13.6214, lng: 123.1947 },
      google_maps_place_id: null,
      contact_phone: null,
      contact_email: null,
      website: null,
      opening_time: '24/7',
      closing_time: '24/7',
      entry_fee: 0,
      status: 'Active',
      is_featured: true,
      average_rating: 4.7,
      review_count: 180,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: null,
      updated_by: null,
    },
    {
      id: '11',
      name: 'Universidad de Sta. Isabel',
      description: 'One of the oldest universities in the Philippines',
      spot_type: 'Historical',
      address: 'Elias Angeles Street, Bagumbayan Sur',
      city: 'Naga City',
      province: 'Camarines Sur',
      location: { lat: 13.6214, lng: 123.1947 },
      google_maps_place_id: null,
      contact_phone: null,
      contact_email: null,
      website: null,
      opening_time: '07:00',
      closing_time: '18:00',
      entry_fee: 0,
      status: 'Active',
      is_featured: false,
      average_rating: 4.4,
      review_count: 110,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: null,
      updated_by: null,
    },
    {
      id: '12',
      name: 'University of Nueva Caceres',
      description: 'A well-known university in Naga City',
      spot_type: 'Historical',
      address: 'J. Hernandez Ave',
      city: 'Naga City',
      province: 'Camarines Sur',
      location: { lat: 13.6214, lng: 123.1947 },
      google_maps_place_id: null,
      contact_phone: null,
      contact_email: null,
      website: null,
      opening_time: '07:00',
      closing_time: '18:00',
      entry_fee: 0,
      status: 'Active',
      is_featured: false,
      average_rating: 4.3,
      review_count: 105,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      created_by: null,
      updated_by: null,
    },
  ];

  const categories = [
    'All',
    'Historical',
    'Natural',
    'Religious Sites',
    'Museum',
    'Urban Attractions',
    'Sports and Recreation',
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleViewDetails = (spot: TouristSpot) => {
    console.log('View details for spot:', spot);
  };

  const filteredAndSearchedSpots = useMemo(() => {
    let filtered = mockSpots;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((spot) => spot.spot_type === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter((spot) =>
        spot.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [mockSpots, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredAndSearchedSpots.length / spotsPerPage);

  const paginatedSpots = useMemo(() => {
    const startIndex = (currentPage - 1) * spotsPerPage;
    const endIndex = startIndex + spotsPerPage;
    return filteredAndSearchedSpots.slice(startIndex, endIndex);
  }, [filteredAndSearchedSpots, currentPage, spotsPerPage]);

  return (
    <View style={styles.container}>
      <View style={styles.filterAndSearchContainer}>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategoryChange}
          categories={categories}
        />
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={() => console.log('Performing search for:', searchQuery)}
          placeholder="Search"
          containerStyle={styles.searchBarContainer}
          inputStyle={styles.searchBarInput}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setAddSpotModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <ThemedText style={styles.filterButtonText}>Add</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TouristSpotTable
          spots={paginatedSpots}
          onViewDetails={handleViewDetails}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </View>

      <AddSpotForm
        isVisible={isAddSpotModalVisible}
        onClose={() => setAddSpotModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  filterAndSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  searchBarContainer: {
    flex: 1,
    maxWidth: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 40,
  },
  searchBarInput: {
    height: '100%',
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
  filterButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default TouristSpots;
