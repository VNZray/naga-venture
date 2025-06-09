import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const BusinessListings = () => {
  const { profile } = useAuth();

  return (
    <View style={styles.container}>
      <ThemedText darkColor="#000" type="title">
        Business Listings Management
      </ThemedText>
      <ThemedText darkColor="#666" type="default">
        Manage business listings and registrations in Naga City
      </ThemedText>

      <View style={styles.content}>
        <ThemedText darkColor="#000" type="subtitle">
          Features Coming Soon...
        </ThemedText>
        <ThemedText darkColor="#666" type="default">
          • Approve/reject business registrations{'\n'}• Edit business
          information{'\n'}• Manage business categories{'\n'}• View business
          analytics{'\n'}• Handle business verification
        </ThemedText>

        {profile?.role === 'tourism_admin' && (
          <View style={styles.adminSection}>
            <ThemedText darkColor="#007AFF" type="subtitle">
              Admin Features
            </ThemedText>
            <ThemedText darkColor="#666" type="default">
              • System-wide business settings{'\n'}• Export business data{'\n'}•
              Bulk operations
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  content: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  adminSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
});

export default BusinessListings;
