import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RouteGuard from '../../../components/ui/RouteGuard';

export default function BusinessRegistrationsScreen() {
  return (
    <RouteGuard routePath="/TourismCMS/(admin)/business-registrations">
      <View style={styles.container}>
        <Text style={styles.title}>Business Registrations Screen</Text>
        <Text>
          This is a placeholder for the Business Registrations content.
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
});
