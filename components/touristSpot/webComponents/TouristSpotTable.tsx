import { ThemedText } from '@/components/ThemedText';
import { TouristSpot } from '@/types/TouristSpot';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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
        <ThemedText style={[styles.tableHeaderText, { width: '30%' }]}>
          Name
        </ThemedText>
        <ThemedText style={[styles.tableHeaderText, { width: '30%' }]}>
          Address
        </ThemedText>
        <ThemedText style={[styles.tableHeaderText, { width: '20%' }]}>
          Category
        </ThemedText>
        <ThemedText style={[styles.tableHeaderText, { width: '10%' }]}>
          Actions
        </ThemedText>
      </View>
      {spots.map((spot) => (
        <View key={spot.id} style={styles.tableRow}>
          <ThemedText style={[styles.tableRowText, { width: '10%' }]}>
            {spot.id}
          </ThemedText>
          <ThemedText style={[styles.tableRowText, { width: '30%' }]}>
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
    maxHeight: 30,
  },
  viewDetailsButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default TouristSpotTable;
