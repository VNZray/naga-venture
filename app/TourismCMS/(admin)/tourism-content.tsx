import RouteGuard from '@/components/ui/RouteGuard';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TourismContentScreen() {
  return (
    <RouteGuard routePath="/TourismCMS/(admin)/tourism-content">
      <View style={styles.container}>
        <Text style={styles.title}>Tourism Content Screen</Text>
        <Text>This is a placeholder for the Tourism Content.</Text>
        <Text style={styles.subtitle}>
          Accessible by Tourism Admins and Tourism Content Managers.
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
