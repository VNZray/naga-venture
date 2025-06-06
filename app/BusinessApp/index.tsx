import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View } from 'react-native';

const BusinessApp = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type="title">Business App</ThemedText>
    </View>
  );
};

export default BusinessApp;
