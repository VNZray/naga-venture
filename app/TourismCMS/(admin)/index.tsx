import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const AdminIndex = () => {
  return (
    <View style={styles.container}>
      <ThemedText darkColor="#000" type="title">
        Admin Overview
      </ThemedText>
      <ThemedText darkColor="#666" type="default">
        Tourism CMS Administration Panel
      </ThemedText>

      <View style={styles.content}>
        <ThemedText darkColor="#000" type="subtitle">
          Welcome to the Admin Panel
        </ThemedText>
        <ThemedText darkColor="#666" type="default">
          Use the navigation menu to access different management sections.
        </ThemedText>
      </View>
    </View>
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
    shadowRadius: 4,
    elevation: 3,
  },
});

export default AdminIndex;
