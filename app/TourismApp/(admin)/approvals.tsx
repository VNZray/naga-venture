import { ThemedText } from '@/components/ThemedText';
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

interface PendingEdit {
  id: string;
  spot_id: string;
  name: string;
  description: string;
  created_at: string;
  created_by: string;
  status: string;
}

const ApprovalsPage = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<ApprovalCategory>('spots');
  const [pendingEdits, setPendingEdits] = useState<PendingEdit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingEdits();
  }, [selectedCategory]);

  const fetchPendingEdits = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tourist_spot_edits')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingEdits(data || []);
    } catch (error) {
      console.error('Error fetching pending edits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item: PendingItem) => {
    try {
      if (item.type === 'edit') {
        // Get the edit details
        const { data: editData, error: editError } = await supabase
          .from('tourist_spot_edits')
          .select('*')
          .eq('id', item.id)
          .single();

        if (editError) throw editError;

        // Update the main spot with the edited data
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
            status: editData.status, // Use the status from the edit
            updated_at: new Date().toISOString(),
          })
          .eq('id', editData.spot_id);

        if (updateError) throw updateError;

        // Update the edit record status
        const { error: statusError } = await supabase
          .from('tourist_spot_edits')
          .update({ status: 'approved' })
          .eq('id', item.id);

        if (statusError) throw statusError;
      } else if (item.type === 'new') {
        // Handle new spot approval
        const { error: updateError } = await supabase
          .from('tourist_spots')
          .update({ status: 'active' })
          .eq('id', item.id);

        if (updateError) throw updateError;
      }

      // Refresh the pending items list
      fetchPendingItems();
    } catch (error) {
      console.error('Error approving item:', error);
    }
  };

  const handleReject = async (editId: string) => {
    try {
      const { error } = await supabase
        .from('tourist_spot_edits')
        .update({ status: 'rejected' })
        .eq('id', editId);

      if (error) throw error;

      // Refresh the pending edits list
      fetchPendingEdits();
    } catch (error) {
      console.error('Error rejecting edit:', error);
    }
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
        <ThemedText style={styles.title}>Approvals</ThemedText>
        <ThemedText style={styles.subtitle}>
          Review and manage pending changes
        </ThemedText>
      </View>

      <View style={styles.categoriesContainer}>
        {renderCategoryCard(
          'spots',
          'location',
          'Tourist Spots',
          pendingEdits.length
        )}
        {renderCategoryCard('business', 'business', 'Businesses', 0)}
        {renderCategoryCard('accommodation', 'bed', 'Accommodations', 0)}
        {renderCategoryCard('events', 'calendar', 'Events', 0)}
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <ThemedText style={styles.tableHeaderText}>Name</ThemedText>
          <ThemedText style={styles.tableHeaderText}>Description</ThemedText>
          <ThemedText style={styles.tableHeaderText}>Date</ThemedText>
          <ThemedText style={styles.tableHeaderText}>Actions</ThemedText>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : pendingEdits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No pending edits found
            </ThemedText>
          </View>
        ) : (
          pendingEdits.map((edit) => (
            <View key={edit.id} style={styles.tableRow}>
              <ThemedText style={styles.tableCell}>{edit.name}</ThemedText>
              <ThemedText style={styles.tableCell} numberOfLines={2}>
                {edit.description}
              </ThemedText>
              <ThemedText style={styles.tableCell}>
                {new Date(edit.created_at).toLocaleDateString()}
              </ThemedText>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleApprove(edit)}
                >
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleReject(edit.id)}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
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
});

export default ApprovalsPage;
