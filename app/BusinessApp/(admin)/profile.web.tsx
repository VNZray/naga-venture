import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View } from 'react-native';

const profile = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type="title" darkColor="#000">
        Web Profile Currently Working On
      </ThemedText>
    </View>
  );
};

export default profile;
