import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View } from 'react-native';

const Guest = () => {
  return (
    <View>
      <ThemedText darkColor="#000" type="title">
        Web Guest Page
      </ThemedText>
    </View>
  );
};

export default Guest;
