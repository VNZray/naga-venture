import SearchBar from '@/components/SearchBar';
import { ThemedText } from '@/components/ThemedText';
import CategoryFilter from '@/components/touristSpot/webComponents/CategoryFilter';
import Pagination from '@/components/touristSpot/webComponents/Pagination';
import TouristSpotTable from '@/components/touristSpot/webComponents/TouristSpotTable';
import { TouristSpot } from '@/types/TouristSpot'; // Import from centralized file
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AddSpotForm from './(spots)/add-spot.web';

const TouristSpots = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddSpotModalVisible, setAddSpotModalVisible] = useState(false);
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['All']); // State for dynamic categories
  const spotsPerPage = 10;

  const router = useRouter();

  const fetchSpotsAndCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Fetch categories
    const { data: categoryData, error: categoryError } = await supabase
      .from('tourist_spots')
      .select('spot_type')
      .order('spot_type', { ascending: true });

    if (categoryError) {
      setError(categoryError.message);
      console.error('Error fetching categories:', categoryError.message);
    } else if (categoryData) {
      const uniqueCategories = [
        'All',
        ...Array.from(new Set(categoryData.map((item) => item.spot_type))),
      ];
      setCategories(uniqueCategories);
    }

    // Fetch spots
    const { data: spotsData, error: spotsError } = await supabase
      .from('tourist_spots')
      .select('*')
      .neq('status', 'pending')
      .order('created_at', { ascending: false });

    if (spotsError) {
      setError(spotsError.message);
      console.error('Error fetching spots:', spotsError.message);
    } else {
      setSpots(spotsData as TouristSpot[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSpotsAndCategories();
  }, [fetchSpotsAndCategories]);

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
    router.push({
      pathname: '/TourismApp/(admin)/(spots)/[id]',
      params: { id: spot.id },
    });
  };

  const filteredAndSearchedSpots = useMemo(() => {
    let filtered = spots;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((spot) => spot.spot_type === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter((spot) =>
        spot.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [spots, selectedCategory, searchQuery]);

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
          onChangeText={handleSearch}
          onSearch={() => console.log('Performing search for:', searchQuery)}
          placeholder="Search"
          containerStyle={styles.searchBarContainer}
          inputStyle={styles.searchBarInput}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddSpotModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <ThemedText style={styles.addButtonText}>Add</ThemedText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
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
      )}

      <AddSpotForm
        isVisible={isAddSpotModalVisible}
        onClose={() => setAddSpotModalVisible(false)}
        onSpotAdded={fetchSpotsAndCategories}
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
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  addButtonText: {
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
