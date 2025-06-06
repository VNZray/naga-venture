import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { Text, View } from 'react-native';

const TourismWebApp = () => {
  return (
    <ThemedView
      style={{
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
      }}
    >
      <View style={{ backgroundColor: 'pink' }}></View>

      <View style={{ backgroundColor: 'red' }}></View>

      <Text>Hello World</Text>
    </ThemedView>
  );
};

export default TourismWebApp;
