import RouteGuard from '@/components/ui/RouteGuard';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SystemSettingsScreen() {
  return (
    <RouteGuard routePath="/TourismCMS/(admin)/system-settings">
      <View style={styles.container}>
        <Text style={styles.title}>System Settings Screen</Text>
        <Text>This is a placeholder for the System Settings content.</Text>
        <Text style={styles.subtitle}>
          Only Tourism Admins can access this section.
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
