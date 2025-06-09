import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TourismContentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tourism Content Screen</Text>
      <Text>This is a placeholder for the Tourism Content.</Text>
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
