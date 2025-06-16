import { ThemedText } from '@/components/ThemedText';
import { TouristSpot } from '@/types/TouristSpot';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

interface PendingItem {
  id: string;
  spot_id?: string;
  name: string;
  description: string;
  created_at: string;
  created_by: string;
  status: string;
  type: 'new' | 'edit' | 'delete';
  spot_type?: string;
  address?: string;
  contact_phone?: string;
  website?: string;
  opening_time?: string;
  closing_time?: string;
  picture?: string;
}

interface ApprovalDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  item: PendingItem | null;
  onApprove: (item: PendingItem) => void;
  onReject: (item: PendingItem) => void;
}

const ApprovalDetailsModal: React.FC<ApprovalDetailsModalProps> = ({
  visible,
  onClose,
  item,
  onApprove,
  onReject,
}) => {
  const [originalSpot, setOriginalSpot] = useState<TouristSpot | null>(null);

  useEffect(() => {
    const fetchOriginalSpot = async () => {
      if (item?.type === 'edit' && item.spot_id) {
        const { data, error } = await supabase
          .from('tourist_spots')
          .select('*')
          .eq('id', item.spot_id)
          .single();

        if (!error && data) {
          setOriginalSpot(data as TouristSpot);
        }
      }
    };

    fetchOriginalSpot();
  }, [item]);

  const renderDetailItem = (
    label: string,
    value: string | null | undefined
  ) => {
    if (!value) return null;
    return (
      <View style={styles.detailItem}>
        <ThemedText style={styles.detailLabel}>{label}:</ThemedText>
        <ThemedText style={styles.detailValue}>{value}</ThemedText>
      </View>
    );
  };

  const renderComparisonItem = (
    label: string,
    oldValue: string | null | undefined,
    newValue: string | null | undefined
  ) => {
    if (!oldValue && !newValue) return null;
    return (
      <View style={styles.comparisonItem}>
        <ThemedText style={styles.detailLabel}>{label}:</ThemedText>
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonColumn}>
            <ThemedText style={styles.comparisonLabel}>Current</ThemedText>
            <ThemedText style={styles.detailValue}>
              {oldValue || '-'}
            </ThemedText>
          </View>
          <View style={styles.comparisonColumn}>
            <ThemedText style={styles.comparisonLabel}>Proposed</ThemedText>
            <ThemedText
              style={[
                styles.detailValue,
                oldValue !== newValue && styles.changedValue,
              ]}
            >
              {newValue || '-'}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#28a745';
      case 'inactive':
        return '#dc3545';
      case 'pending':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.headerContent}>
              <ThemedText style={styles.modalTitle}>
                {item.type === 'new' ? 'New Tourist Spot' : 'Spot Edit Details'}
              </ThemedText>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) + '20' },
                ]}
              >
                <ThemedText
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {item.type === 'edit' && originalSpot ? (
              <>
                {item.picture && (
                  <View style={styles.imageContainer}>
                    <ThemedText style={styles.detailLabel}>Picture:</ThemedText>
                    <View style={styles.comparisonContainer}>
                      <View style={styles.comparisonColumn}>
                        <ThemedText style={styles.comparisonLabel}>
                          Current
                        </ThemedText>
                        <Image
                          source={{ uri: originalSpot.picture || '' }}
                          style={styles.spotImage}
                          resizeMode="cover"
                        />
                      </View>
                      <View style={styles.comparisonColumn}>
                        <ThemedText style={styles.comparisonLabel}>
                          Proposed
                        </ThemedText>
                        <Image
                          source={{ uri: item.picture }}
                          style={styles.spotImage}
                          resizeMode="cover"
                        />
                      </View>
                    </View>
                  </View>
                )}
                {renderComparisonItem('Name', originalSpot.name, item.name)}
                {renderComparisonItem(
                  'Description',
                  originalSpot.description,
                  item.description
                )}
                {renderComparisonItem(
                  'Type',
                  originalSpot.spot_type,
                  item.spot_type
                )}
                {renderComparisonItem(
                  'Address',
                  originalSpot.address,
                  item.address
                )}
                {renderComparisonItem(
                  'Contact Phone',
                  originalSpot.contact_phone,
                  item.contact_phone
                )}
                {renderComparisonItem(
                  'Website',
                  originalSpot.website,
                  item.website
                )}
                {renderComparisonItem(
                  'Opening Time',
                  originalSpot.opening_time,
                  item.opening_time
                )}
                {renderComparisonItem(
                  'Closing Time',
                  originalSpot.closing_time,
                  item.closing_time
                )}
              </>
            ) : (
              <>
                {item.picture && (
                  <View style={styles.imageContainer}>
                    <ThemedText style={styles.detailLabel}>Picture:</ThemedText>
                    <Image
                      source={{ uri: item.picture }}
                      style={styles.spotImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
                {renderDetailItem('Name', item.name)}
                {renderDetailItem('Description', item.description)}
                {renderDetailItem('Type', item.spot_type)}
                {renderDetailItem('Address', item.address)}
                {renderDetailItem('Contact Phone', item.contact_phone)}
                {renderDetailItem('Website', item.website)}
                {renderDetailItem('Opening Time', item.opening_time)}
                {renderDetailItem('Closing Time', item.closing_time)}
              </>
            )}
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.approveButton]}
              onPress={() => {
                onApprove(item);
                onClose();
              }}
            >
              <ThemedText style={styles.modalButtonText}>Approve</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.rejectButton]}
              onPress={() => {
                onReject(item);
                onClose();
              }}
            >
              <ThemedText style={styles.modalButtonText}>Reject</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '70%',
    height: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
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
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 15,
    flex: 1,
  },
  detailItem: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    color: '#000',
  },
  comparisonItem: {
    marginBottom: 15,
  },
  comparisonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  comparisonColumn: {
    flex: 1,
  },
  comparisonLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  changedValue: {
    color: '#28a745',
    fontWeight: '600',
  },
  imageContainer: {
    marginTop: 10,
  },
  spotImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 5,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 10,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ApprovalDetailsModal;
