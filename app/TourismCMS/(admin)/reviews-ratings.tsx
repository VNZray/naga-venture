import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CMSRouteGuard, CMSText } from '@/components/TourismCMS';

export default function ReviewsRatingsScreen() {
  return (
    <CMSRouteGuard routePath="/TourismCMS/(admin)/reviews-ratings">
      <View style={styles.container}>
        <CMSText type="title" style={styles.title}>Reviews & Ratings Screen</CMSText>
        <CMSText type="body">This is a placeholder for the Reviews & Ratings content.</CMSText>
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
});
