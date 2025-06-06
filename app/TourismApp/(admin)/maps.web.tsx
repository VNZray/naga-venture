import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View } from 'react-native';

const Maps = () => {
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <ThemedText type="title" darkColor="#000">
        Web Maps
      </ThemedText>
    </View>
  );
};

export default Maps;
