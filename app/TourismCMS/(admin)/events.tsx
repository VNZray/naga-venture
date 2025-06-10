import { ThemedText } from '@/components/ThemedText';
import RouteGuard from '@/components/ui/RouteGuard';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Events = () => {
  const { userProfile } = useAuth();

  return (
    <RouteGuard routePath="/TourismCMS/(admin)/events">
      <View style={styles.container}>
        <ThemedText darkColor="#000" type="title">
          Events Management
        </ThemedText>
        <ThemedText darkColor="#666" type="default">
          Manage events, festivals, and activities in Naga City
        </ThemedText>

        <View style={styles.content}>
          <ThemedText darkColor="#000" type="subtitle">
            Features Coming Soon...
          </ThemedText>
          <ThemedText darkColor="#666" type="default">
            • Create and edit events{'\n'}• Set event dates and schedules{'\n'}•
            Manage event categories{'\n'}• Upload event photos{'\n'}• Handle
            event registrations
          </ThemedText>

          {userProfile?.role === 'tourism_admin' && (
            <View style={styles.adminSection}>
              <ThemedText darkColor="#007AFF" type="subtitle">
                Admin Features
              </ThemedText>
              <ThemedText darkColor="#666" type="default">
                • Featured events management{'\n'}• Event approval workflow
                {'\n'}• Analytics and attendance tracking
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </RouteGuard>
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

export default Events;
