import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function BusinessListingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business Listings Screen</Text>
      <Text>This is a placeholder for the Business Listings content.</Text>
    </View>
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
