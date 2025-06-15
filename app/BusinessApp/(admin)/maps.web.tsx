import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View } from 'react-native';

const Maps = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type="title" darkColor="#000">
        Web Maps Will Be Available Soon
      </ThemedText>
    </View>
  );
};

export default Maps;
