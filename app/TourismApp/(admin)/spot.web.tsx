import { supabase } from '@/lib/supabase-client';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import CategoryFilter from './components/CategoryFilter';
import Pagination from './components/Pagination';
import TouristSpotTable from './components/TouristSpotTable';

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
  const [touristSpots, setTouristSpots] = useState<TouristSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = [
    'All',
    'Historical',
    'Natural',
    'Religious Sites',
    'Museum',
    'Urban Attractions',
    'Sports and Recreation',
  ];

  useEffect(() => {
    const fetchTouristSpots = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('tourist_spots').select('*');

      if (error) {
        console.error('Error fetching tourist spots:', error);
        setError(error.message);
      } else {
        setTouristSpots(data as TouristSpot[]);
      }
      setLoading(false);
    };

    fetchTouristSpots();
  }, []);

  const handleViewDetails = useCallback((spot: TouristSpot) => {
    // Implement view details functionality
    console.log('View details for spot:', spot);
  }, []);

  const filteredSpots =
    selectedCategory === 'All'
      ? touristSpots
      : touristSpots.filter((spot) => spot.spot_type === selectedCategory);

  const totalPages = Math.ceil(filteredSpots.length / itemsPerPage);
  const paginatedSpots = filteredSpots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.filterSearchContainer}>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        <View style={styles.searchAddContainer}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#888"
            />
          </View>
        </View>
      </View>

      <TouristSpotTable
        spots={paginatedSpots}
        onViewDetails={handleViewDetails}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  filterSearchContainer: {
    marginBottom: 20,
  },
  searchAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
  },
});

export default TouristSpots;
