import { CMSRouteGuard, CMSText } from '@/components/TourismCMS';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function UserManagementScreen() {
  return (
    <CMSRouteGuard routePath="/TourismCMS/(admin)/user-management">
      <View style={styles.container}>
        <CMSText type="title" style={styles.title}>
          User Management Screen
        </CMSText>
        <CMSText type="body">
          This is a placeholder for the User Management content.
        </CMSText>
        <CMSText type="caption" style={styles.subtitle}>
          Only Tourism Admins can access this section.
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
