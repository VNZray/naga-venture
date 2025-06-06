import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View } from 'react-native';

const TouristSpots = () => {
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <ThemedText darkColor="#000" type="title">
        Tourist Spots
      </ThemedText>
    </View>
  );
};

export default TouristSpots;
