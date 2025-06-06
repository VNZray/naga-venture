import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View } from 'react-native';

const Feedback = () => {
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
        Web Feedback
      </ThemedText>
    </View>
  );
};

export default Feedback;
