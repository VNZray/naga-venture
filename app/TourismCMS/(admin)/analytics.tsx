import { CMSRouteGuard, CMSText } from '@/components/TourismCMS';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function AnalyticsScreen() {
  return (
    <CMSRouteGuard routePath="/TourismCMS/(admin)/analytics">
      <View style={styles.container}>
        <CMSText type="title" style={styles.title}>
          Analytics Screen
        </CMSText>
        <CMSText type="body">
          This is a placeholder for the Analytics content.
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
});
