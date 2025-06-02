import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { Text } from 'react-native';

const BusinessWebApp = () => {
  return (
    <ThemedView
      style={{
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
      }}
    >
      <Text>Hello World</Text>
    </ThemedView>
  );
};

export default BusinessWebApp;
