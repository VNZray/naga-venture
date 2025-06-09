import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Accommodations = () => {
  return (
    <View style={styles.container}>
      <ThemedText darkColor="#000" type="title">
        Accommodation Management
      </ThemedText>
      <ThemedText darkColor="#666" type="default">
        Manage hotels, resorts, and other accommodations in Naga City
      </ThemedText>

      <View style={styles.content}>
        <ThemedText darkColor="#000" type="subtitle">
          Coming Soon...
        </ThemedText>
        <ThemedText darkColor="#666" type="default">
          This section will allow you to add, edit, and manage accommodation
          listings.
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

export default Accommodations;
