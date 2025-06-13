import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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

interface TouristSpotTableProps {
  spots: TouristSpot[];
  onViewDetails: (spot: TouristSpot) => void;
}

const TouristSpotTable: React.FC<TouristSpotTableProps> = ({
  spots,
  onViewDetails,
}) => {
  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <ThemedText style={[styles.tableHeaderText, { width: '10%' }]}>
          ID
        </ThemedText>
        <ThemedText style={[styles.tableHeaderText, { width: '25%' }]}>
          Name
        </ThemedText>
        <ThemedText style={[styles.tableHeaderText, { width: '30%' }]}>
          Address
        </ThemedText>
        <ThemedText style={[styles.tableHeaderText, { width: '20%' }]}>
          Category
        </ThemedText>
        <ThemedText style={[styles.tableHeaderText, { width: '15%' }]}>
          Actions
        </ThemedText>
      </View>
      {spots.map((spot) => (
        <View key={spot.id} style={styles.tableRow}>
          <ThemedText style={[styles.tableRowText, { width: '10%' }]}>
            {spot.id}
          </ThemedText>
          <ThemedText style={[styles.tableRowText, { width: '25%' }]}>
            {spot.name}
          </ThemedText>
          <ThemedText style={[styles.tableRowText, { width: '30%' }]}>
            {spot.address}
          </ThemedText>
          <ThemedText style={[styles.tableRowText, { width: '20%' }]}>
            {spot.spot_type}
          </ThemedText>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => onViewDetails(spot)}
          >
            <ThemedText style={styles.viewDetailsButtonText}>
              View Full Details
            </ThemedText>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#002f5e',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableRowText: {
    color: '#000',
    fontSize: 14,
  },
  viewDetailsButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  viewDetailsButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default TouristSpotTable;
