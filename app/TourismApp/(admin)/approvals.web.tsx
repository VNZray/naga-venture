import { ThemedText } from '@/components/ThemedText';
import ApprovalDetailsModal from '@/components/touristSpot/webComponents/ApprovalDetailsModal';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

type ApprovalCategory = 'spots' | 'business' | 'accommodation' | 'events';
type ApprovalType = 'new' | 'edit' | 'delete';

interface PendingItem {
  id: string;
  spot_id?: string;
  name: string;
  description: string;
  created_at: string;
  created_by: string;
  status: string;
  type: ApprovalType;
  spot_type?: string;
  address?: string;
  contact_phone?: string;
  website?: string;
  opening_time?: string;
  closing_time?: string;
  picture?: string;
}

const ApprovalsPage = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<ApprovalCategory>('spots');
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
  const [categoryCounts, setCategoryCounts] = useState({
    spots: 0,
    business: 0,
    accommodation: 0,
    events: 0,
  });

  useEffect(() => {
    fetchPendingItems();
  }, [selectedCategory]);

  const fetchPendingItems = async () => {
    setLoading(true);
    try {
      // Only fetch data for spots category since others are not implemented yet
      if (selectedCategory === 'spots') {
        // Fetch pending edits
        const { data: editsData, error: editsError } = await supabase
          .from('tourist_spot_edits')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (editsError) throw editsError;

        // Fetch new spots
        const { data: spotsData, error: spotsError } = await supabase
          .from('tourist_spots')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (spotsError) throw spotsError;

        // Fetch delete requests
        const { data: deletesData, error: deletesError } = await supabase
          .from('tourist_spot_deletes')
          .select(
            `
            *,
            tourist_spots (
              name,
              description
            )
          `
          )
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (deletesError) throw deletesError;

        // Combine and format the data
        const formattedEdits = (editsData || []).map((edit) => ({
          ...edit,
          type: 'edit' as ApprovalType,
        }));

        const formattedSpots = (spotsData || []).map((spot) => ({
          ...spot,
          type: 'new' as ApprovalType,
        }));

        const formattedDeletes = (deletesData || []).map((deleteReq) => ({
          ...deleteReq,
          type: 'delete' as ApprovalType,
          name: deleteReq.tourist_spots.name,
          description: deleteReq.tourist_spots.description,
        }));

        // Filter out spots that have pending edits or deletes
        const spotsWithEdits = new Set(
          formattedEdits.map((edit) => edit.spot_id)
        );
        const spotsWithDeletes = new Set(
          formattedDeletes.map((deleteReq) => deleteReq.spot_id)
        );
        const newSpots = formattedSpots.filter(
          (spot) =>
            !spotsWithEdits.has(spot.id) && !spotsWithDeletes.has(spot.id)
        );

        setPendingItems(
          [...formattedEdits, ...formattedDeletes, ...newSpots].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
        );

        setCategoryCounts((prev) => ({
          ...prev,
          spots:
            formattedEdits.length + formattedDeletes.length + newSpots.length,
        }));
      } else {
        // For other categories, set empty array since they're not implemented
        setPendingItems([]);
      }
    } catch (error) {
      console.error('Error fetching pending items:', error);
      setPendingItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item: PendingItem) => {
    try {
      if (item.type === 'edit') {
        // Handle edit approval
        const { data: editData, error: fetchError } = await supabase
          .from('tourist_spot_edits')
          .select('*')
          .eq('id', item.id)
          .single();

        if (fetchError) throw fetchError;

        // Update the main spot with the edit data
        const { error: updateError } = await supabase
          .from('tourist_spots')
          .update({
            name: editData.name,
            description: editData.description,
            spot_type: editData.spot_type,
            address: editData.address,
            contact_phone: editData.contact_phone,
            website: editData.website,
            opening_time: editData.opening_time,
            closing_time: editData.closing_time,
            picture: editData.picture,
            status: 'active',
            updated_at: new Date().toISOString(),
            updated_by: editData.created_by,
          })
          .eq('id', editData.spot_id);

        if (updateError) throw updateError;

        // Update the edit status to active
        const { error: statusError } = await supabase
          .from('tourist_spot_edits')
          .update({ status: 'active' })
          .eq('id', item.id);

        if (statusError) throw statusError;
      } else if (item.type === 'delete') {
        // Handle delete approval
        const { data: deleteData, error: fetchError } = await supabase
          .from('tourist_spot_deletes')
          .select('*')
          .eq('id', item.id)
          .single();

        if (fetchError) throw fetchError;

        // Delete the spot
        const { error: deleteError } = await supabase
          .from('tourist_spots')
          .delete()
          .eq('id', deleteData.spot_id);

        if (deleteError) throw deleteError;

        // Update the delete request status to active
        const { error: statusError } = await supabase
          .from('tourist_spot_deletes')
          .update({ status: 'active' })
          .eq('id', item.id);

        if (statusError) throw statusError;
      } else {
        // Handle new spot approval
        const { error: updateError } = await supabase
          .from('tourist_spots')
          .update({
            status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id);

        if (updateError) throw updateError;
      }

      // Update the counts
      setCategoryCounts((prev) => ({
        ...prev,
        spots: prev.spots - 1,
      }));

      // Refresh the pending items list
      fetchPendingItems();
    } catch (error) {
      console.error('Error approving item:', error);
    }
  };

  const handleReject = async (item: PendingItem) => {
    try {
      if (item.type === 'edit') {
        const { error } = await supabase
          .from('tourist_spot_edits')
          .update({
            status: 'inactive',
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id);

        if (error) throw error;
      } else if (item.type === 'delete') {
        const { error } = await supabase
          .from('tourist_spot_deletes')
          .update({
            status: 'inactive',
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tourist_spots')
          .update({
            status: 'inactive',
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id);

        if (error) throw error;
      }

      // Update the counts
      setCategoryCounts((prev) => ({
        ...prev,
        spots: prev.spots - 1,
      }));

      // Refresh the pending items list
      fetchPendingItems();
    } catch (error) {
      console.error('Error rejecting item:', error);
    }
  };

  const handleView = (item: PendingItem) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

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

  const renderCategoryCard = (
    category: ApprovalCategory,
    icon: string,
    title: string,
    count: number
  ) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategory === category && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Ionicons
        name={icon as any}
        size={24}
        color={selectedCategory === category ? '#fff' : '#666'}
      />
      <ThemedText
        style={[
          styles.categoryTitle,
          selectedCategory === category && styles.selectedCategoryText,
        ]}
      >
        {title}
      </ThemedText>
      <ThemedText
        style={[
          styles.categoryCount,
          selectedCategory === category && styles.selectedCategoryText,
        ]}
      >
        {count}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.subtitle}>
          Review and manage pending changes
        </ThemedText>
      </View>

      <View style={styles.categoriesContainer}>
        {renderCategoryCard(
          'spots',
          'location',
          'Tourist Spots',
          categoryCounts.spots
        )}
        {renderCategoryCard(
          'business',
          'business',
          'Businesses',
          categoryCounts.business
        )}
        {renderCategoryCard(
          'accommodation',
          'bed',
          'Accommodations',
          categoryCounts.accommodation
        )}
        {renderCategoryCard(
          'events',
          'calendar',
          'Events',
          categoryCounts.events
        )}
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <ThemedText style={styles.tableHeaderText}>Type</ThemedText>
          <ThemedText style={styles.tableHeaderText}>Name</ThemedText>
          <ThemedText style={styles.tableHeaderText}>Description</ThemedText>
          <ThemedText style={styles.tableHeaderText}>Date</ThemedText>
          <ThemedText style={styles.tableHeaderText}>Actions</ThemedText>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : selectedCategory !== 'spots' ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              {selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1)}{' '}
              approvals are not yet implemented
            </ThemedText>
          </View>
        ) : pendingItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No pending items found
            </ThemedText>
          </View>
        ) : (
          pendingItems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <ThemedText style={styles.tableCell}>
                {item.type === 'new'
                  ? 'New Spot'
                  : item.type === 'edit'
                  ? 'Edit'
                  : 'Delete'}
              </ThemedText>
              <ThemedText style={styles.tableCell}>{item.name}</ThemedText>
              <ThemedText style={styles.tableCell} numberOfLines={2}>
                {item.description}
              </ThemedText>
              <ThemedText style={styles.tableCell}>
                {new Date(item.created_at).toLocaleDateString()}
              </ThemedText>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.viewButton]}
                  onPress={() => handleView(item)}
                >
                  <Ionicons name="eye" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleApprove(item)}
                >
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleReject(item)}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <ApprovalDetailsModal
        visible={selectedItem !== null}
        onClose={closeModal}
        item={selectedItem}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 15,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCategory: {
    backgroundColor: '#007bff',
  },
  categoryTitle: {
    fontSize: 14,
    marginTop: 8,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  categoryCount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#666',
  },
  tableContainer: {
    backgroundColor: '#fff',
    margin: 20,
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
    flex: 1,
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
  tableCell: {
    flex: 1,
    color: '#333',
  },
  actionButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#007bff',
  },
  approveButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
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
});

export default ApprovalsPage;
