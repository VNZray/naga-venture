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
  // Filter out only pending spots, show all others
  const filteredSpots = spots.filter((spot) => spot.status !== 'pending');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#28a745';
      case 'inactive':
        return '#dc3545';
      case 'under_maintenance':
        return '#ffc107';
      case 'coming_soon':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <ThemedText style={[styles.tableHeaderText, { width: '25%' }]}>
          Name
        </ThemedText>
        <ThemedText style={[styles.tableHeaderText, { width: '30%' }]}>
          Address
        </ThemedText>
        <ThemedText style={[styles.tableHeaderText, { width: '15%' }]}>
          Category
        </ThemedText>
        <ThemedText style={[styles.tableHeaderText, { width: '15%' }]}>
          Status
        </ThemedText>
        <ThemedText style={[styles.tableHeaderText, { width: '15%' }]}>
          Actions
        </ThemedText>
      </View>
      {filteredSpots.map((spot) => (
        <View key={spot.id} style={styles.tableRow}>
          <ThemedText style={[styles.tableRowText, { width: '25%' }]}>
            {spot.name}
          </ThemedText>
          <ThemedText style={[styles.tableRowText, { width: '30%' }]}>
            {spot.address}
          </ThemedText>
          <ThemedText style={[styles.tableRowText, { width: '15%' }]}>
            {spot.spot_type}
          </ThemedText>
          <View style={[styles.statusCell, { width: '15%' }]}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(spot.status) + '20' },
              ]}
            >
              <ThemedText
                style={[
                  styles.statusText,
                  { color: getStatusColor(spot.status) },
                ]}
              >
                {formatStatus(spot.status)}
              </ThemedText>
            </View>
          </View>
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
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  tableRowText: {
    color: '#333',
  },
  statusCell: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  viewDetailsButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  viewDetailsButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TouristSpotTable;
