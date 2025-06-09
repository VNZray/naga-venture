import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ContentApprovalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Content Approval Screen</Text>
      <Text>This is a placeholder for the Content Approval content.</Text>
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
