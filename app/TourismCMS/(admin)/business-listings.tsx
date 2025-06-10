import RouteGuard from '@/components/ui/RouteGuard';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function BusinessListingsScreen() {
  return (
    <RouteGuard routePath="/TourismCMS/(admin)/business-listings">
      <View style={styles.container}>
        <Text style={styles.title}>Business Listings Screen</Text>
        <Text>This is a placeholder for the Business Listings content.</Text>
        <Text style={styles.subtitle}>
          Accessible by Tourism Admins and Business Listing Managers.
        </Text>
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
});
