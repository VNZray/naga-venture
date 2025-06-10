import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CMSRouteGuard, CMSText } from '@/components/TourismCMS';

export default function ContentApprovalScreen() {
  return (
    <CMSRouteGuard routePath="/TourismCMS/(admin)/content-approval">
      <View style={styles.container}>
        <CMSText type="title" style={styles.title}>Content Approval Screen</CMSText>
        <CMSText type="body">This is a placeholder for the Content Approval content.</CMSText>
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
