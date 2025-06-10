import { CMSRouteGuard, CMSText } from '@/components/TourismCMS';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function CategoriesScreen() {
  return (
    <CMSRouteGuard routePath="/TourismCMS/(admin)/categories">
      <View style={styles.container}>
        <CMSText type="title" style={styles.title}>Categories Screen</CMSText>
        <CMSText type="body">This is a placeholder for the Categories content.</CMSText>
        <CMSText type="body" style={styles.subtitle}>
          Accessible by Tourism Admins, Business Listing Managers, and Tourism
          Content Managers.
        </CMSText>
      </View>
    </CMSRouteGuard>
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
