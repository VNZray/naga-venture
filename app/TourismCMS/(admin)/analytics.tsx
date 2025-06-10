import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RouteGuard from '../../../components/ui/RouteGuard';

export default function AnalyticsScreen() {
  return (
    <RouteGuard routePath="/TourismCMS/(admin)/analytics">
      <View style={styles.container}>
        <Text style={styles.title}>Analytics Screen</Text>
        <Text>This is a placeholder for the Analytics content.</Text>
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
});
